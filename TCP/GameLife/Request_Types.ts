export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'wrong-ssl-pinning' | 'error';

export type ServerStatus =
    | 'offline'
    | 'ok'
    | 'free'
    | 'waitMailConfirmation'
    | 'newDevice'
    | 'remDevice'
    | 'maintenance'
    | 'update'
    | 'downdate'
    | 'limitDevice'
    | 'error';

export type LoginStatus = 'ok' | 'free' | 'waitMailConfirmation' | 'newDevice' | 'remDevice' | 'limitDevice' | 'error';

export type SigninStatus = 'ok' | 'pseudoUsed' | 'pseudoIncorrect' | 'limitAccount' | 'error';
