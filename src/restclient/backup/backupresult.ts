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
    private _state: BackupResultState;
    private _result: BackupResultResult;
    private _message: string;

    get state(): BackupResultState {
        return this._state;
    }

    set state(value: string) {
        if (value === 'stop') {
            this._state = BackupResultState.STATE_STOP;
        } else if (this._state === 'backup') {
            this._state = BackupResultState.STATE_BACKUP;
        } else if (this._state === 'restore') {
            this._state = BackupResultState.STATE_RESTORE;
        } else {
            throw Error('Unknown state.');
        }
    }

    get result(): BackupResultResult {
        return this._result;
    }

    set result(value: string) {
        if (value === 'success') {
            this._result = BackupResultResult.RESULT_SUCCESS;
        } else if (value === 'failed') {
            this._result = BackupResultResult.RESULT_FAILED;
        } else if (value === 'process') {
            this._result = BackupResultResult.RESULT_PROCESS;
        } else {
            throw Error('Unknown result.');
        }
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }
}
