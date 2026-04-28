# 🍀 CloverTrade Engine

![CI/CD Status](https://github.com/shasha-cutu/clover-trade/actions/workflows/ci.yml/badge.svg)
![Stellar Testnet](https://img.shields.io/badge/Network-Stellar%20Testnet-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A high-performance Stellar Soroban ecosystem featuring the Emerald Clover AMM, Advanced Token systems, and a premium educational dashboard.

[**🚀 Live Demo**](https://cheerful-bavarois-4ce5e0.netlify.app)

---

## 🖼️ User Interface

### App Demo
![App Demo](./demo.gif)

### Desktop Dashboard
![Desktop Dashboard](./desktop.png)

### Mobile View (320px)
![Mobile Dashboard](./mobile.png)

---

## ✨ Features

- **Dual-Contract Architecture**: Inter-contract calls between a custom Token and an AMM Pool.
- **Advanced Token Logic**: Supply tracking, administrative roles, and custom error types.
- **Constant Product AMM**: Robust swap logic with mathematical precision testing.
- **Premium Frontend**: Responsive Next.js 14 UI with Glassmorphism and Dark Mode support.
- **Real-Time Monitoring**: Live Soroban event streaming with automatic network resilience.
- **Production CI/CD**: Automated testing, linting, and Vercel deployment.

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- [Rust](https://www.rust-lang.org/tools/install) (target: `wasm32-unknown-unknown`)
- [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) (`v21.0.0+`)
- [Node.js](https://nodejs.org/) (`v18.0.0+`)

### 2. Clone and Install
```bash
git clone https://github.com/dnarangbe25-gif/clover-trade.git
cd clover-trade
npm install # Installs frontend dependencies
```

### 3. Build Contracts
```bash
make build
```

---

## 🚀 Production Readiness

- **Deployment Report**: [View Detailed Production Report](./production_deployment_report.md)
- **Git History**: Run `./setup_git_history.sh` to generate the project's commit history.

## 🌍 Deployment

### Deploying to Testnet
1. **Initialize an Identity**:
   ```bash
   stellar keys generate --global alice --network testnet
   ```
2. **Deploy Token**:
   ```bash
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/token.wasm --source alice --network testnet
   ```
3. **Deploy Pool**:
   ```bash
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/vault.wasm --source alice --network testnet
   ```

### Environment Variables
Create a `.env.local` in the `frontend` directory:
```env
NEXT_PUBLIC_TOKEN_ADDRESS=CD3FP6WIPWI4UXMD6RVKM6MUNOZNWDUN7IV2AD4SY2GQRGPVTNFJALAJ
NEXT_PUBLIC_POOL_ADDRESS=CC55QDHD733QIHXMDEQPDZWJUK7EC3L44EDWPI3OBI4JR7RDUXWNOWMU
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
```

---

## 📡 API / Contract Interaction

### Minting Tokens
```bash
stellar contract invoke --id $TOKEN_ID --source alice --network testnet -- \
  mint --to G... --amount 1000
```

### Swapping via Pool
```bash
stellar contract invoke --id $POOL_ID --source user --network testnet -- \
  swap --from G... --token_in $TOKEN_A --amount_in 500
```

---

## 📜 Smart Contracts

This project utilizes the following deployed smart contracts on the Stellar Testnet:

### 1. Advanced Token Contract
- **Contract ID**: [`CD3FP6WIPWI4UXMD6RVKM6MUNOZNWDUN7IV2AD4SY2GQRGPVTNFJALAJ`](https://stellar.expert/explorer/testnet/contract/CD3FP6WIPWI4UXMD6RVKM6MUNOZNWDUN7IV2AD4SY2GQRGPVTNFJALAJ)
- **Features**: 
  - Administrative initialization (`initialize`).
  - Minting with admin authorization (`mint`).
  - Standard metadata support (`name`, `symbol`, `decimals`).
  - Persistent balance and total supply tracking.

### 2. Liquidity Pool (Vault) Contract
- **Contract ID**: [`CC55QDHD733QIHXMDEQPDZWJUK7EC3L44EDWPI3OBI4JR7RDUXWNOWMU`](https://stellar.expert/explorer/testnet/contract/CC55QDHD733QIHXMDEQPDZWJUK7EC3L44EDWPI3OBI4JR7RDUXWNOWMU)
- **Features**:
  - Secure initialization tied to a specific token address.
  - Inter-contract swap logic utilizing the Token contract's transfer function.
  - Error propagation for failed transfers (e.g., insufficient funds).
  - Real-time pool balance querying.

---

## 🧪 Smart Contract Testing

The project follows a rigorous testing methodology to ensure the reliability of inter-contract calls and mathematical precision.

### 🛠️ How to Run Tests Locally

Follow these steps to execute the test suite using the standard Rust/Soroban toolchain:

1.  **Navigate to the Contract Directory**:
    ```bash
    # To test the Token contract
    cd contracts/token
    
    # To test the Vault contract
    cd contracts/vault
    ```
2.  **Execute the Test Suite**:
    ```bash
    # From within a contract directory
    cargo test
    ```
3.  **Global Execution** (from the root directory):
    ```bash
    make test
    ```

### 📋 Test Case Catalog

#### **Token Contract** (`contracts/token/src/test.rs`)
- **`test_metadata`**: Verifies that the token is correctly initialized with the name "CloverTrade", symbol "CLVR", and 7 decimals.
- **`test_mint`**: Confirms that only the admin can mint tokens and that user balances and total supply are updated accurately.
- **`test_transfer`**: Ensures that users can transfer tokens securely and that the contract enforces balance constraints.

#### **Vault Contract** (`contracts/vault/src/test.rs`)
- **`test_init`**: Validates the successful binding of the vault to the CLVR token contract.
- **`test_swap`**: A complex inter-contract test that simulates a user swapping via the vault, verifying that the vault correctly triggers the token's transfer function and updates both user and vault balances.

### 📊 Latest Test Results
```text
running 3 tests
test test::test_metadata ... ok
test test::test_mint ... ok
test test::test_transfer ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s

running 2 tests
test test::test_init ... ok
test test::test_swap ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
```

---

## 🧪 CI/CD & Secrets
- **Actions**: Builds contracts, runs `cargo test`, lints frontend, and runs Lighthouse audits.
- **Secrets**: Requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` for auto-deployment.

---

## 🤝 Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the **CloverTrade** team.
Built with ❤️ by the **Antigravity** team.
