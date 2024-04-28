# passwardmanager

## Working of this project

step 1 : clone the repository [password manager](https://github.com/ChiragKpoojary/passwardmanagerhttps://github.com/ChiragKpoojary/passwardmanager)

```bash
git clone https://github.com/ChiragKpoojary/passwardmanager
cd passwardmanager
```

step 2 : install dependencies using the bash script. The bash script can be run using Ubuntu terminal or git bash in windows. It will install dependencies for both client and sever

```bash
sh run.sh install
```

step 2 : run the development client and server host in separate terminal using the script
```bash
sh run.sh client
sh run.sh server
```

To expose the client host to the network, run the below bash command
```bash
sh run.sh host
```

## Installing specific package

```bash
sh run.sh install <directory> <package>
```

directory: client || server
package: any npm package