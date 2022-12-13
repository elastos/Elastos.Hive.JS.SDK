/**
 * The script content for querying.
 */
export class ScriptContent {
    private name: string;
    private condition: any;
    private executable: any;
    private allowAnonymousUser: boolean;
    private allowAnonymousApp: boolean;

    setName(name: string) {
        this.name = name;
        return this;
    }

    setCondition(condition: any) {
        this.condition = condition;
        return this;
    }

    setExecutable(executable: any) {
        this.executable = executable;
        return this;
    }

    setAllowAnonymousUser(anonymous: boolean) {
        this.allowAnonymousUser = anonymous;
        return this;
    }

    setAllowAnonymousApp(anonymous: boolean) {
        this.allowAnonymousApp = anonymous;
        return this;
    }

    getName(): string {
        return this.name;
    }

    getCondition(): string {
        return this.condition;
    }

    getExecutable(): string {
        return this.executable;
    }

    getAllowAnonymousUser(): boolean {
        return this.allowAnonymousUser;
    }

    getAllowAnonymousApp(): boolean {
        return this.allowAnonymousApp;
    }
}
