inotifywait -m /data |
    while read path action file; do
        echo "$path - $file - $action"
    done




