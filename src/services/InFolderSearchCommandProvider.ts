import { Injectable } from "@furystack/inject";
import { Repository, ConstantContent } from "@sensenet/client-core";
import { CommandPaletteItem } from "../store/CommandPalette";
import { CommandProvider } from "./CommandProviderManager";
import { Query } from "@sensenet/query"
import { PathHelper } from "@sensenet/client-utils";

@Injectable()
export class InFolderSearchCommandProvider implements CommandProvider {
    constructor(private readonly repository: Repository) {
       
    }

    public shouldExec(searchTerm: string): boolean {
        return searchTerm[0] === '/'
    }

    public async getItems(path: string): Promise<CommandPaletteItem[]> {
        const currentPath = PathHelper.trimSlashes(path);
        const segments = currentPath.split("/");
        const parentPath = PathHelper.trimSlashes(PathHelper.joinPaths(...segments.slice(0, segments.length - 1)) || currentPath)
        const result = await this.repository.loadCollection({
            path: ConstantContent.PORTAL_ROOT.Path,
            oDataOptions: {
                query: new Query(q => q.inFolder(`/${currentPath}`).or.query(sub => sub.inFolder(`/${parentPath}`).and.equals("Path", `/${currentPath}*`)).sort("Path")).toString(),
                top: 10,
                select: ["Id", "Path", "Type", "Name", "DisplayName", "Icon", "Avatar"]
            }
        })
        return result.d.results.map(content => ({
            primaryText: content.DisplayName || content.Name,
            secondaryText: content.Path
        }))
    }
}