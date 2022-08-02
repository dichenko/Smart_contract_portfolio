/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ACDMplatformInterface extends ethers.utils.Interface {
  functions: {
    "DAO()": FunctionFragment;
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "addOrder(uint256,uint256)": FunctionFragment;
    "buyAcdm()": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "orders(uint256)": FunctionFragment;
    "redeemOrder(uint256)": FunctionFragment;
    "referralRewardBank()": FunctionFragment;
    "refers(address)": FunctionFragment;
    "register(address)": FunctionFragment;
    "registered(address)": FunctionFragment;
    "removeOrder(uint256)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "setSaleRoundReferRewards(uint256,uint256)": FunctionFragment;
    "setTradeRoundReferRewards(uint256,uint256)": FunctionFragment;
    "startPlatform()": FunctionFragment;
    "startSaleRound()": FunctionFragment;
    "startTradeRound()": FunctionFragment;
    "status()": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "withdraw()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "DAO", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addOrder",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "buyAcdm", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "orders",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemOrder",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "referralRewardBank",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "refers", values: [string]): string;
  encodeFunctionData(functionFragment: "register", values: [string]): string;
  encodeFunctionData(functionFragment: "registered", values: [string]): string;
  encodeFunctionData(
    functionFragment: "removeOrder",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setSaleRoundReferRewards",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTradeRoundReferRewards",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "startPlatform",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "startSaleRound",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "startTradeRound",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "status", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(functionFragment: "DAO", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addOrder", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buyAcdm", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "orders", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "referralRewardBank",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "refers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registered", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setSaleRoundReferRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTradeRoundReferRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "startPlatform",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "startSaleRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "startTradeRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "status", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "OrderExecuted(uint256)": EventFragment;
    "OrderPlaced(uint256,uint256,uint256)": EventFragment;
    "OrderRemoved(uint256)": EventFragment;
    "OrderUpdated(uint256,uint256)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OrderExecuted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrderPlaced"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrderRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrderUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
}

export type OrderExecutedEvent = TypedEvent<[BigNumber] & { _id: BigNumber }>;

export type OrderPlacedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber] & {
    id: BigNumber;
    amount: BigNumber;
    price: BigNumber;
  }
>;

export type OrderRemovedEvent = TypedEvent<[BigNumber] & { _id: BigNumber }>;

export type OrderUpdatedEvent = TypedEvent<
  [BigNumber, BigNumber] & { _id: BigNumber; amount: BigNumber }
>;

export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string] & {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
>;

export type RoleGrantedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type RoleRevokedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export class ACDMplatform extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ACDMplatformInterface;

  functions: {
    DAO(overrides?: CallOverrides): Promise<[string]>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    addOrder(
      _amount: BigNumberish,
      _price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    buyAcdm(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    orders(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, BigNumber, BigNumber] & {
        executed: boolean;
        seller: string;
        amount: BigNumber;
        price: BigNumber;
      }
    >;

    redeemOrder(
      _id: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    referralRewardBank(overrides?: CallOverrides): Promise<[BigNumber]>;

    refers(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    register(
      _refer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    registered(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    removeOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSaleRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTradeRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startPlatform(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startSaleRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startTradeRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    status(overrides?: CallOverrides): Promise<[number]>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  DAO(overrides?: CallOverrides): Promise<string>;

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  addOrder(
    _amount: BigNumberish,
    _price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  buyAcdm(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  orders(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [boolean, string, BigNumber, BigNumber] & {
      executed: boolean;
      seller: string;
      amount: BigNumber;
      price: BigNumber;
    }
  >;

  redeemOrder(
    _id: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  referralRewardBank(overrides?: CallOverrides): Promise<BigNumber>;

  refers(arg0: string, overrides?: CallOverrides): Promise<string>;

  register(
    _refer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  registered(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  removeOrder(
    _id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSaleRoundReferRewards(
    _newPercent1: BigNumberish,
    _newPercent2: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTradeRoundReferRewards(
    _newPercent1: BigNumberish,
    _newPercent2: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startPlatform(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startSaleRound(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startTradeRound(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  status(overrides?: CallOverrides): Promise<number>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  withdraw(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DAO(overrides?: CallOverrides): Promise<string>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    addOrder(
      _amount: BigNumberish,
      _price: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    buyAcdm(overrides?: CallOverrides): Promise<void>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    orders(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, BigNumber, BigNumber] & {
        executed: boolean;
        seller: string;
        amount: BigNumber;
        price: BigNumber;
      }
    >;

    redeemOrder(_id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    referralRewardBank(overrides?: CallOverrides): Promise<BigNumber>;

    refers(arg0: string, overrides?: CallOverrides): Promise<string>;

    register(_refer: string, overrides?: CallOverrides): Promise<void>;

    registered(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    removeOrder(_id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setSaleRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTradeRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    startPlatform(overrides?: CallOverrides): Promise<void>;

    startSaleRound(overrides?: CallOverrides): Promise<void>;

    startTradeRound(overrides?: CallOverrides): Promise<void>;

    status(overrides?: CallOverrides): Promise<number>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    withdraw(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "OrderExecuted(uint256)"(
      _id?: null
    ): TypedEventFilter<[BigNumber], { _id: BigNumber }>;

    OrderExecuted(
      _id?: null
    ): TypedEventFilter<[BigNumber], { _id: BigNumber }>;

    "OrderPlaced(uint256,uint256,uint256)"(
      id?: null,
      amount?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { id: BigNumber; amount: BigNumber; price: BigNumber }
    >;

    OrderPlaced(
      id?: null,
      amount?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { id: BigNumber; amount: BigNumber; price: BigNumber }
    >;

    "OrderRemoved(uint256)"(
      _id?: null
    ): TypedEventFilter<[BigNumber], { _id: BigNumber }>;

    OrderRemoved(_id?: null): TypedEventFilter<[BigNumber], { _id: BigNumber }>;

    "OrderUpdated(uint256,uint256)"(
      _id?: null,
      amount?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { _id: BigNumber; amount: BigNumber }
    >;

    OrderUpdated(
      _id?: null,
      amount?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { _id: BigNumber; amount: BigNumber }
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    "RoleGranted(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "RoleRevoked(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;
  };

  estimateGas: {
    DAO(overrides?: CallOverrides): Promise<BigNumber>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    addOrder(
      _amount: BigNumberish,
      _price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    buyAcdm(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    orders(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    redeemOrder(
      _id: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    referralRewardBank(overrides?: CallOverrides): Promise<BigNumber>;

    refers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    register(
      _refer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    registered(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    removeOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSaleRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTradeRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startPlatform(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startSaleRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startTradeRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    status(overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DAO(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addOrder(
      _amount: BigNumberish,
      _price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    buyAcdm(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    orders(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    redeemOrder(
      _id: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    referralRewardBank(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    refers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    register(
      _refer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    registered(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSaleRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTradeRoundReferRewards(
      _newPercent1: BigNumberish,
      _newPercent2: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startPlatform(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startSaleRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startTradeRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    status(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}