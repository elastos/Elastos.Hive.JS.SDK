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

    setState(state: BackupResultState) {
        this.state = state;
        return this;
    }

    setResult(result: BackupResultResult) {
        this.result = result;
        return this;
    }

    setMessage(message: string) {
        this.message = message;
        return this;
    }

    getState(): BackupResultState {
        return this.state;
    }

    getResult(): BackupResultResult {
        return this.result;
    }

    getMessage(): string {
        return this.message;
    }
}
