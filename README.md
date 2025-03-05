## Notes
- Run clear && ps aux | grep next to find the next dev process and kill it

### Gen keytool for android apps
```bash
keytool -genkeypair -v \
-keystore my-release-key.keystore \
-alias my-key-alias \
-keyalg RSA \
-keysize 2048 \
-validity 10000 \
-dname "CN=John Doe, OU=MyDept, O=MyCompany, L=New York, ST=NY, C=US" \
-storepass mykeystorepassword \
-keypass mykeypassword
```