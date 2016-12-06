cd /data
touch finish
while true; do
    sleep .5
    for new in `find . -name *.tex -mtime -0.00000579`; do
        pdflatex -interaction batchmode -file-line-error $new
        touch finish
    done
done
