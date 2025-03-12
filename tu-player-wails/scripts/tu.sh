#/!bin/sh
clear
action=$1
args=$2

echo -e "Running with [ $args ]\n"
test_file='"/home/tonni/Downloads/The Simpsons S00-S09 (1989-) + Shorts (1987-1989)/The Simpsons S05 (360p)/The Simpsons S05E03 Homer Goes to College.mp4"'


function gen_deb(){
    echo -e "\nPackaging .deb bundle....\n"
    cd tools && nfpm pkg --packager deb --target ../build/bin
}

function build_wails_app(){
    echo -e "\nBuilding wails app...\n"
    tsx tools/tool.ts
    wails build -nosyncgomod -devtools
}

if [ "$action" = "build" ]
then
    echo -e "Building app...\n"
    
    case $args in
        # case --deb-only
        "--deb-only")
        gen_deb
        ;;
        "--no-pkg")
        build_wails_app
        ;;
        # default
        *)
        build_wails_app
        gen_deb
        ;;
    esac

else
    echo -e "Running app...\n"
    echo -e "App args: $test_file\n"
    WAILS_NO_UPDATE_CHECK=true wails dev -nosyncgomod -s -loglevel Info -appargs "$test_file"
fi