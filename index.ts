/**
 * @file index.ts
 * @description Main entry point for the Gamelife-Types module
 * @author OxyFoo
 */

// Exports from the Class file
export * from './Class/Consent';
export * from './Class/Experience';
export * from './Class/NotificationsInApp';
export * from './Class/Rewards';
export * from './Class/Settings';
export * from './Class/Shop';
export * from './Class/ZapGPT';

// Exports from the Data file and its subfolders
export * from './Data/App';
export * from './Data/Server';
export * from './Data/User';

// Exports from the global file
export * from './Global/Langs';
export * from './Global/Links';
export * from './Global/OS';
export * from './Global/Rarities';
export * from './Global/Themes';
export * from './Global/Utils';

// Exports from the interface folder
export * from './Interface/IAppData';
export * from './Interface/IUserClass';
export * from './Interface/IUserData';

// Exports from the TCP file
export * from './TCP/GameLife/Request';
export * from './TCP/GameLife/Request_ClientToServer';
export * from './TCP/GameLife/Request_ServerToClient';
export * from './TCP/GameLife/Request_Types';
