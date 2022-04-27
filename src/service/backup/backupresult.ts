export enum BackupResultState {
    STATE_STOP = "stop",
    STATE_BACKUP = "backup",
    STATE_RESTORE = "restore",
}

export enum BackupResultResult {
    RESULT_SUCCESS = "success",
    RESULT_FAILED = "failed",
    RESULT_PROCESS = "process"
}

export class BackupResult {
    private state: BackupResultState;
    private result: BackupResultResult;
    private message: string;

    public getState(): BackupResultState {
        return this.state;
    }

    public getResult(): BackupResultResult {
        return this.result;
    }

    public getMessage(): string {
        return this.message;
    }
}
