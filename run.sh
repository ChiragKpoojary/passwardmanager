clear

if [ "$1" == 'install' ] || [ "$1" == 'i' ]; then
    if [ "$2" == 'client' ] || [ "$2" == 'server' ]; then
        if [ -z "$3" ]; then
            echo "Usage: run.sh install | i : install all dependencies"
            echo "run.sh install client <pkg> : install pkg for client"
            echo "run.sh install server <pkg> : install pkg for server"
            exit
        else
            echo "installing $3 for $2..."
            cd $2 && npm install $3
            exit
        fi        
    fi
    echo "installing..."
    echo "installing for client..."
    cd client && npm install
    echo "installing for server..."
    cd ../server && npm install
elif [ "$1" == "client" ]; then
    echo "dev client..."
    cd client && npm start
elif [ "$1" == "server" ]; then
    echo "dev server..."
    cd server && npm start
elif [ "$1" == "host" ]; then
    echo "dev client host ..."
    cd client && npm run host
else
    echo "Usage: run.sh [command]"
    echo "run.sh install | i : install all dependencies"
    echo "run.sh client : run client server"
    echo "run.sh server : run server server"
fi