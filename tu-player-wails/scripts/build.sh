clear
tsx ../tools/tool.ts
cd ../
wails build -nosyncgomod
echo "Packaging .deb bundle"
cd tools && nfpm pkg --packager deb --target ../build
