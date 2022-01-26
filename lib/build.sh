wasm-pack build --scope j7w2 --release
cp README.md ./pkg
cd pkg
npm publish --access=public