 Sūrya's Description Report

 Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\contracts\DAO.sol | f8ce2206d33bfa11da54919622cbfb7c03065d66 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\token\ERC20\IERC20.sol | 3f8f9d66083281998547ead9e2a599f5e3d049f8 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\access\AccessControl.sol | 0c41116733b006fff28f246e5f94b2d4e27476f7 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\access\IAccessControl.sol | 2b849a2b0daaf0a0bc7173bb5c866ea5bd2e7ba6 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\utils\Context.sol | 719844505df30bda93516e78eab1ced3bfe9ff4a |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\utils\Strings.sol | 64a06a9e23bae30c0bbeb4b6acb408ae54f6c379 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\utils\introspection\ERC165.sol | b3cc6713a4ecd5a40a432dd8a7382c609564ee1a |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\utils\introspection\IERC165.sol | d9d927f913d1d062ea9931d132a2f49f5e0cc423 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\contracts\Staking.sol | b0f35b590250be6a044f88d88c4f2a86be203358 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\contracts\GovernanceToken.sol | 4e45e03dcf3e866c7c6c06b079c6d2f49920c7ba |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\token\ERC20\ERC20.sol | a1d74f68b995fd6b21d18f71c76fb72a1bc8be2b |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\token\ERC20\extensions\IERC20Metadata.sol | 87b62db9a86c0b9bbc58b51d0d2ae7a8b7688800 |
| c:\Users\user\Documents\GitHub\Smart_contract_portfolio\07_DAO\node_modules\@openzeppelin\contracts\access\Ownable.sol | 691ac8cc8ecc93fa144beb50c3b0263300d15321 |


 Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **DAO** | Implementation | AccessControl |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | addProposal | External ❗️ | 🛑  | onlyRole |
| └ | deposit | External ❗️ | 🛑  |NO❗️ |
| └ | withdraw | External ❗️ | 🛑  |NO❗️ |
| └ | vote | External ❗️ | 🛑  |NO❗️ |
| └ | finish | External ❗️ | 🛑  |NO❗️ |
||||||
| **IERC20** | Interface |  |||
| └ | totalSupply | External ❗️ |   |NO❗️ |
| └ | balanceOf | External ❗️ |   |NO❗️ |
| └ | transfer | External ❗️ | 🛑  |NO❗️ |
| └ | allowance | External ❗️ |   |NO❗️ |
| └ | approve | External ❗️ | 🛑  |NO❗️ |
| └ | transferFrom | External ❗️ | 🛑  |NO❗️ |
||||||
| **AccessControl** | Implementation | Context, IAccessControl, ERC165 |||
| └ | supportsInterface | Public ❗️ |   |NO❗️ |
| └ | hasRole | Public ❗️ |   |NO❗️ |
| └ | _checkRole | Internal 🔒 |   | |
| └ | _checkRole | Internal 🔒 |   | |
| └ | getRoleAdmin | Public ❗️ |   |NO❗️ |
| └ | grantRole | Public ❗️ | 🛑  | onlyRole |
| └ | revokeRole | Public ❗️ | 🛑  | onlyRole |
| └ | renounceRole | Public ❗️ | 🛑  |NO❗️ |
| └ | _setupRole | Internal 🔒 | 🛑  | |
| └ | _setRoleAdmin | Internal 🔒 | 🛑  | |
| └ | _grantRole | Internal 🔒 | 🛑  | |
| └ | _revokeRole | Internal 🔒 | 🛑  | |
||||||
| **IAccessControl** | Interface |  |||
| └ | hasRole | External ❗️ |   |NO❗️ |
| └ | getRoleAdmin | External ❗️ |   |NO❗️ |
| └ | grantRole | External ❗️ | 🛑  |NO❗️ |
| └ | revokeRole | External ❗️ | 🛑  |NO❗️ |
| └ | renounceRole | External ❗️ | 🛑  |NO❗️ |
||||||
| **Context** | Implementation |  |||
| └ | _msgSender | Internal 🔒 |   | |
| └ | _msgData | Internal 🔒 |   | |
||||||
| **Strings** | Library |  |||
| └ | toString | Internal 🔒 |   | |
| └ | toHexString | Internal 🔒 |   | |
| └ | toHexString | Internal 🔒 |   | |
| └ | toHexString | Internal 🔒 |   | |
||||||
| **ERC165** | Implementation | IERC165 |||
| └ | supportsInterface | Public ❗️ |   |NO❗️ |
||||||
| **IERC165** | Interface |  |||
| └ | supportsInterface | External ❗️ |   |NO❗️ |
||||||
| **Staking** | Implementation | AccessControl |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | setPercent | Public ❗️ | 🛑  | onlyRole |
||||||
| **GovernanceToken** | Implementation | ERC20, Ownable |||
| └ | <Constructor> | Public ❗️ | 🛑  | ERC20 |
||||||
| **ERC20** | Implementation | Context, IERC20, IERC20Metadata |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | name | Public ❗️ |   |NO❗️ |
| └ | symbol | Public ❗️ |   |NO❗️ |
| └ | decimals | Public ❗️ |   |NO❗️ |
| └ | totalSupply | Public ❗️ |   |NO❗️ |
| └ | balanceOf | Public ❗️ |   |NO❗️ |
| └ | transfer | Public ❗️ | 🛑  |NO❗️ |
| └ | allowance | Public ❗️ |   |NO❗️ |
| └ | approve | Public ❗️ | 🛑  |NO❗️ |
| └ | transferFrom | Public ❗️ | 🛑  |NO❗️ |
| └ | increaseAllowance | Public ❗️ | 🛑  |NO❗️ |
| └ | decreaseAllowance | Public ❗️ | 🛑  |NO❗️ |
| └ | _transfer | Internal 🔒 | 🛑  | |
| └ | _mint | Internal 🔒 | 🛑  | |
| └ | _burn | Internal 🔒 | 🛑  | |
| └ | _approve | Internal 🔒 | 🛑  | |
| └ | _spendAllowance | Internal 🔒 | 🛑  | |
| └ | _beforeTokenTransfer | Internal 🔒 | 🛑  | |
| └ | _afterTokenTransfer | Internal 🔒 | 🛑  | |
||||||
| **IERC20Metadata** | Interface | IERC20 |||
| └ | name | External ❗️ |   |NO❗️ |
| └ | symbol | External ❗️ |   |NO❗️ |
| └ | decimals | External ❗️ |   |NO❗️ |
||||||
| **Ownable** | Implementation | Context |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | owner | Public ❗️ |   |NO❗️ |
| └ | _checkOwner | Internal 🔒 |   | |
| └ | renounceOwnership | Public ❗️ | 🛑  | onlyOwner |
| └ | transferOwnership | Public ❗️ | 🛑  | onlyOwner |
| └ | _transferOwnership | Internal 🔒 | 🛑  | |


 Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
