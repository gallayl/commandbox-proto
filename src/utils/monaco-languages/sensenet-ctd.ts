type IRichLanguageConfiguration = import('monaco-editor').languages.LanguageConfiguration
type ILanguage = import('monaco-editor').languages.IMonarchLanguage
type ILanguageExtensionPoint = import('monaco-editor').languages.ILanguageExtensionPoint
import { getXsdCompletionProvider } from '../monaco-xml-utils/completition-provider'
import { ContentTypeDefinitionXsd } from '../xsd-schemas'

declare const monaco: any

export const SensenetCtdCompetitionProvider: import('monaco-editor').languages.DocumentFormattingEditProvider = {
  provideDocumentFormattingEdits: (model: import('monaco-editor').editor.IReadOnlyModel) => {
    const PADDING = '\t' // set desired indent size here
    const reg = /(>)(<)(\/*)/g
    let pad = 0
    let xml = model.getValue()
    xml = xml.replace(reg, '$1\r\n$2$3')
    const formatted = xml
      .split('\r\n')
      .map(node => {
        let indent = 0
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0
        } else if (node.match(/^<\/\w/) && pad > 0) {
          pad -= 1
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1
        } else {
          indent = 0
        }
        pad += indent
        return PADDING.repeat(pad - indent) + node
      })
      .join('\r\n')
    return [
      {
        eol: 0,
        text: formatted,
        range: model.getFullModelRange(),
      },
    ] as Array<import('monaco-editor').languages.TextEdit>
  },
}

export class SensenetCtdLanguage {
  public static readonly LanguageId: string = 'sensenet-ctd'
  private static readonly config: IRichLanguageConfiguration = {
    comments: {
      blockComment: ['<!--', '-->'],
    },
    brackets: [['<', '>']],
    autoClosingPairs: [{ open: '<', close: '>' }, { open: "'", close: "'" }, { open: '"', close: '"' }],
    surroundingPairs: [{ open: '<', close: '>' }, { open: "'", close: "'" }, { open: '"', close: '"' }],
  }

  private static readonly language = {
    defaultToken: '',
    tokenPostfix: '.xml',

    ignoreCase: true,

    // Useful regular expressions
    qualifiedName: /(?:[\w\.\-]+:)?[\w\.\-]+/,

    tokenizer: {
      root: [
        [/[^<&]+/, ''],

        { include: '@whitespace' },

        // Standard opening tag
        [/(<)(@qualifiedName)/, [{ token: 'delimiter' }, { token: 'tag', next: '@tag' }]],

        // Standard closing tag
        [/(<\/)(@qualifiedName)(\s*)(>)/, [{ token: 'delimiter' }, { token: 'tag' }, '', { token: 'delimiter' }]],

        // Meta tags - instruction
        [/(<\?)(@qualifiedName)/, [{ token: 'delimiter' }, { token: 'metatag', next: '@tag' }]],

        // Meta tags - declaration
        [/(<\!)(@qualifiedName)/, [{ token: 'delimiter' }, { token: 'metatag', next: '@tag' }]],

        // CDATA
        [/<\!\[CDATA\[/, { token: 'delimiter.cdata', next: '@cdata' }],

        [/&\w+;/, 'string.escape'],
      ],

      cdata: [[/[^\]]+/, ''], [/\]\]>/, { token: 'delimiter.cdata', next: '@pop' }], [/\]/, '']],

      tag: [
        [/[ \t\r\n]+/, ''],
        [/(@qualifiedName)(\s*=\s*)("[^"]*"|'[^']*')/, ['attribute.name', '', 'attribute.value']],
        [/(@qualifiedName)(\s*=\s*)("[^">?\/]*|'[^'>?\/]*)(?=[\?\/]\>)/, ['attribute.name', '', 'attribute.value']],
        [/(@qualifiedName)(\s*=\s*)("[^">]*|'[^'>]*)/, ['attribute.name', '', 'attribute.value']],
        [/@qualifiedName/, 'attribute.name'],
        [/\?>/, { token: 'delimiter', next: '@pop' }],
        [/(\/)(>)/, [{ token: 'tag' }, { token: 'delimiter', next: '@pop' }]],
        [/>/, { token: 'delimiter', next: '@pop' }],
      ],

      whitespace: [[/[ \t\r\n]+/, ''], [/<!--/, { token: 'comment', next: '@comment' }]],

      comment: [
        [/[^<\-]+/, 'comment.content'],
        [/-->/, { token: 'comment', next: '@pop' }],
        [/<!--/, 'comment.content.invalid'],
        [/[<\-]/, 'comment.content'],
      ],
    },
  } as ILanguage

  private static readonly extensionPoint: ILanguageExtensionPoint = {
    id: SensenetCtdLanguage.LanguageId,
    extensions: [],
    aliases: ['sensenet ECM Content type definition'],
  }

  private static isRegistered: boolean = false

  public static Register() {
    if (!this.isRegistered) {
      this.isRegistered = true
      monaco.languages.register(this.extensionPoint)
      monaco.languages.setMonarchTokensProvider(this.LanguageId, this.language)
      monaco.languages.setLanguageConfiguration(this.LanguageId, this.config)
      monaco.languages.registerDocumentFormattingEditProvider(this.LanguageId, SensenetCtdCompetitionProvider)
      monaco.languages.registerCompletionItemProvider(
        this.LanguageId,
        getXsdCompletionProvider(ContentTypeDefinitionXsd),
      )
    }
  }
}
