# clean up previous remains, if any
rm -rf Contents/Resources
rm -rf Flow.docset
mkdir -p Contents/Resources/Documents

# create a fresh sqlite db
cd Contents/Resources
sqlite3 docSet.dsidx 'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)'
sqlite3 docSet.dsidx 'CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path)'

# fetch the whole doc site
cd Documents
# Excluding /blog directory
wget -m -p -E -k -np -X /blog http://flowtype.org/

# move it around a bit
mv flowtype.org/ flow
cd ../../../

# create data file from base index page
node src/createSectionJSON.js

# change the documentation markup layout a bit to fit dash's small window
node src/modifyDocsHTML.js

# read the previously fetched doc site and parse it into sqlite
node src/index.js

# bundle up!
mkdir Flow.docset
cp -r Contents Flow.docset
cp src/icon* Flow.docset

# Create gzip bundle for Dash Contribution
tar --exclude='.DS_Store' -cvzf Flow.tgz Flow.docset