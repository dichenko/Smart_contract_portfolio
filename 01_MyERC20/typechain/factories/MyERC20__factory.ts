/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MyERC20, MyERC20Interface } from "../MyERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tokenSymbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_initialAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "remaining",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001a0c38038062001a0c833981810160405281019062000037919062000389565b33600260016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600390816200008991906200067a565b5082600490816200009b91906200067a565b5081600260006101000a81548160ff021916908360ff16021790555080600581905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405162000161919062000772565b60405180910390a3505050506200078f565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001dc8262000191565b810181811067ffffffffffffffff82111715620001fe57620001fd620001a2565b5b80604052505050565b60006200021362000173565b9050620002218282620001d1565b919050565b600067ffffffffffffffff821115620002445762000243620001a2565b5b6200024f8262000191565b9050602081019050919050565b60005b838110156200027c5780820151818401526020810190506200025f565b838111156200028c576000848401525b50505050565b6000620002a9620002a38462000226565b62000207565b905082815260208101848484011115620002c857620002c76200018c565b5b620002d58482856200025c565b509392505050565b600082601f830112620002f557620002f462000187565b5b81516200030784826020860162000292565b91505092915050565b600060ff82169050919050565b620003288162000310565b81146200033457600080fd5b50565b60008151905062000348816200031d565b92915050565b6000819050919050565b62000363816200034e565b81146200036f57600080fd5b50565b600081519050620003838162000358565b92915050565b60008060008060808587031215620003a657620003a56200017d565b5b600085015167ffffffffffffffff811115620003c757620003c662000182565b5b620003d587828801620002dd565b945050602085015167ffffffffffffffff811115620003f957620003f862000182565b5b6200040787828801620002dd565b93505060406200041a8782880162000337565b92505060606200042d8782880162000372565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200048c57607f821691505b602082108103620004a257620004a162000444565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200050c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620004cd565b620005188683620004cd565b95508019841693508086168417925050509392505050565b6000819050919050565b60006200055b620005556200054f846200034e565b62000530565b6200034e565b9050919050565b6000819050919050565b62000577836200053a565b6200058f620005868262000562565b848454620004da565b825550505050565b600090565b620005a662000597565b620005b38184846200056c565b505050565b5b81811015620005db57620005cf6000826200059c565b600181019050620005b9565b5050565b601f8211156200062a57620005f481620004a8565b620005ff84620004bd565b810160208510156200060f578190505b620006276200061e85620004bd565b830182620005b8565b50505b505050565b600082821c905092915050565b60006200064f600019846008026200062f565b1980831691505092915050565b60006200066a83836200063c565b9150826002028217905092915050565b620006858262000439565b67ffffffffffffffff811115620006a157620006a0620001a2565b5b620006ad825462000473565b620006ba828285620005df565b600060209050601f831160018114620006f25760008415620006dd578287015190505b620006e985826200065c565b86555062000759565b601f1984166200070286620004a8565b60005b828110156200072c5784890151825560018201915060208501945060208101905062000705565b868310156200074c578489015162000748601f8916826200063c565b8355505b6001600288020188555050505b505050505050565b6200076c816200034e565b82525050565b600060208201905062000789600083018462000761565b92915050565b61126d806200079f6000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c806370a082311161007157806370a08231146101a35780638da5cb5b146101d357806395d89b41146101f1578063a0712d681461020f578063a9059cbb1461023f578063dd62ed3e1461026f576100b4565b806306fdde03146100b9578063095ea7b3146100d757806318160ddd1461010757806323b872dd14610125578063313ce5671461015557806342966c6814610173575b600080fd5b6100c161029f565b6040516100ce9190610d31565b60405180910390f35b6100f160048036038101906100ec9190610dec565b61032d565b6040516100fe9190610e47565b60405180910390f35b61010f61041f565b60405161011c9190610e71565b60405180910390f35b61013f600480360381019061013a9190610e8c565b610425565b60405161014c9190610e47565b60405180910390f35b61015d610600565b60405161016a9190610efb565b60405180910390f35b61018d60048036038101906101889190610f16565b610613565b60405161019a9190610e47565b60405180910390f35b6101bd60048036038101906101b89190610f43565b6107c6565b6040516101ca9190610e71565b60405180910390f35b6101db61080e565b6040516101e89190610f7f565b60405180910390f35b6101f9610834565b6040516102069190610d31565b60405180910390f35b61022960048036038101906102249190610f16565b6108c2565b6040516102369190610e47565b60405180910390f35b61025960048036038101906102549190610dec565b610a75565b6040516102669190610e47565b60405180910390f35b61028960048036038101906102849190610f9a565b610c11565b6040516102969190610e71565b60405180910390f35b600380546102ac90611009565b80601f01602080910402602001604051908101604052809291908181526020018280546102d890611009565b80156103255780601f106102fa57610100808354040283529160200191610325565b820191906000526020600020905b81548152906001019060200180831161030857829003601f168201915b505050505081565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161040d9190610e71565b60405180910390a36001905092915050565b60055481565b600081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156104e6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104dd90611086565b60405180910390fd5b816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461053491906110d5565b92505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105899190611109565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516105ed9190610e71565b60405180910390a3600190509392505050565b600260009054906101000a900460ff1681565b6000600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146106a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161069c906111ab565b60405180910390fd5b81600080600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461071591906110d5565b92505081905550816005600082825461072e91906110d5565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff16600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516107b59190610e71565b60405180910390a360019050919050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6004805461084190611009565b80601f016020809104026020016040519081016040528092919081815260200182805461086d90611009565b80156108ba5780601f1061088f576101008083540402835291602001916108ba565b820191906000526020600020905b81548152906001019060200180831161089d57829003601f168201915b505050505081565b6000600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610954576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161094b906111ab565b60405180910390fd5b81600080600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546109c49190611109565b9250508190555081600560008282546109dd9190611109565b92505081905550600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a649190610e71565b60405180910390a360019050919050565b6000816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015610af8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aef90611217565b60405180910390fd5b816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610b4691906110d5565b92505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610b9b9190611109565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610bff9190610e71565b60405180910390a36001905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610cd2578082015181840152602081019050610cb7565b83811115610ce1576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d0382610c98565b610d0d8185610ca3565b9350610d1d818560208601610cb4565b610d2681610ce7565b840191505092915050565b60006020820190508181036000830152610d4b8184610cf8565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610d8382610d58565b9050919050565b610d9381610d78565b8114610d9e57600080fd5b50565b600081359050610db081610d8a565b92915050565b6000819050919050565b610dc981610db6565b8114610dd457600080fd5b50565b600081359050610de681610dc0565b92915050565b60008060408385031215610e0357610e02610d53565b5b6000610e1185828601610da1565b9250506020610e2285828601610dd7565b9150509250929050565b60008115159050919050565b610e4181610e2c565b82525050565b6000602082019050610e5c6000830184610e38565b92915050565b610e6b81610db6565b82525050565b6000602082019050610e866000830184610e62565b92915050565b600080600060608486031215610ea557610ea4610d53565b5b6000610eb386828701610da1565b9350506020610ec486828701610da1565b9250506040610ed586828701610dd7565b9150509250925092565b600060ff82169050919050565b610ef581610edf565b82525050565b6000602082019050610f106000830184610eec565b92915050565b600060208284031215610f2c57610f2b610d53565b5b6000610f3a84828501610dd7565b91505092915050565b600060208284031215610f5957610f58610d53565b5b6000610f6784828501610da1565b91505092915050565b610f7981610d78565b82525050565b6000602082019050610f946000830184610f70565b92915050565b60008060408385031215610fb157610fb0610d53565b5b6000610fbf85828601610da1565b9250506020610fd085828601610da1565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061102157607f821691505b60208210810361103457611033610fda565b5b50919050565b7f4e6f7420617070726f7665640000000000000000000000000000000000000000600082015250565b6000611070600c83610ca3565b915061107b8261103a565b602082019050919050565b6000602082019050818103600083015261109f81611063565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006110e082610db6565b91506110eb83610db6565b9250828210156110fe576110fd6110a6565b5b828203905092915050565b600061111482610db6565b915061111f83610db6565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611154576111536110a6565b5b828201905092915050565b7f596f7520617265206e6f7420616e206f776e6572000000000000000000000000600082015250565b6000611195601483610ca3565b91506111a08261115f565b602082019050919050565b600060208201905081810360008301526111c481611188565b9050919050565b7f4e6f7420656e6f75676820746f6b656e73000000000000000000000000000000600082015250565b6000611201601183610ca3565b915061120c826111cb565b602082019050919050565b60006020820190508181036000830152611230816111f4565b905091905056fea264697066735822122028a4948fd3f00d756ca540438004253beb4811b0874ce4335b9f3e66368340f964736f6c634300080f0033";

export class MyERC20__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _tokenName: string,
    _tokenSymbol: string,
    _decimals: BigNumberish,
    _initialAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MyERC20> {
    return super.deploy(
      _tokenName,
      _tokenSymbol,
      _decimals,
      _initialAmount,
      overrides || {}
    ) as Promise<MyERC20>;
  }
  getDeployTransaction(
    _tokenName: string,
    _tokenSymbol: string,
    _decimals: BigNumberish,
    _initialAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _tokenName,
      _tokenSymbol,
      _decimals,
      _initialAmount,
      overrides || {}
    );
  }
  attach(address: string): MyERC20 {
    return super.attach(address) as MyERC20;
  }
  connect(signer: Signer): MyERC20__factory {
    return super.connect(signer) as MyERC20__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MyERC20Interface {
    return new utils.Interface(_abi) as MyERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MyERC20 {
    return new Contract(address, _abi, signerOrProvider) as MyERC20;
  }
}
