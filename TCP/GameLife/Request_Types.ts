export type ConnectionState = 'idle' | 'connected' | 'authenticated' | 'connecting' | 'disconnected' | 'error';

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
