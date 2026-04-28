#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_init() {
    let env = Env::default();
    env.mock_all_auths();

    let vault_id = env.register_contract(None, PoolContract);
    let vault_client = PoolContractClient::new(&env, &vault_id);

    let token_address = Address::generate(&env);
    
    vault_client.init(&token_address);
    // As it stands, there is no getter for the token_address, 
    // but the initialization itself shouldn't panic.
}
#[test]
fn test_swap() {
    let env = Env::default();
    env.mock_all_auths();

    // Register Token (using the wasm from target)
    let token_id = env.register_contract_wasm(None, crate::token::WASM);
    let token_client = crate::token::Client::new(&env, &token_id);

    // Register Vault
    let vault_id = env.register_contract(None, PoolContract);
    let vault_client = PoolContractClient::new(&env, &vault_id);

    // Initialize
    let admin = Address::generate(&env);
    token_client.initialize(&admin, &soroban_sdk::String::from_str(&env, "CloverTrade"), &soroban_sdk::String::from_str(&env, "CLVR"));
    vault_client.init(&token_id);

    // Mint to user
    let user = Address::generate(&env);
    token_client.mint(&user, &1000);

    // Swap
    vault_client.swap(&user, &500);

    assert_eq!(token_client.balance_of(&user), 500);
    assert_eq!(token_client.balance_of(&vault_id), 500);
}
