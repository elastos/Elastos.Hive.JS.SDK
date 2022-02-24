export enum BackupResultState {
    STATE_STOP = "stop",
    STATE_BACKUP = "backup",
    STATE_RESTORE = "restore"
}

export enum BackupResultResult {
    RESULT_SUCCESS = "success",
    RESULT_FAILED = "failed",
    RESULT_PROCESS = "process"
}

export class BackupResult {
    private _state: string;
    private _result: string;
    private _message: string;

    get state(): BackupResultState {
        if (this._state === 'stop') {
            return BackupResultState.STATE_STOP;
        } else if (this._state === 'backup') {
            return BackupResultState.STATE_BACKUP;
        } else if (this._state === 'restore') {
            return BackupResultState.STATE_RESTORE;
        } else {
            throw Error('Unknown state.');
        }
    }

    set state(value: string) {
        this._state = value;
    }

    get result(): BackupResultResult {
        if (this._result === 'success') {
            return BackupResultResult.RESULT_SUCCESS;
        } else if (this._state === 'failed') {
            return BackupResultResult.RESULT_FAILED;
        } else if (this._state === 'process') {
            return BackupResultResult.RESULT_PROCESS;
        } else {
            throw Error('Unknown result.');
        }
    }

    set result(value: string) {
        this._result = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }
}
