import { CommandProvider } from "./CommandProviderManager";
import { CommandPaletteItem } from "../store/CommandPalette";
import { Injectable } from "@furystack/inject";

@Injectable()
export class HistoryCommandProvider implements CommandProvider {
    public shouldExec(term: string){
        return term.length === 0;
    }
    public async getItems(): Promise<CommandPaletteItem[]>{
        return [{
            primaryText: "Recently Opened Example",
            secondaryText: "You've opened recently this stuff"
        }]
    }


}