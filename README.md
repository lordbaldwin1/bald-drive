# Drive

## TODO

- [x] Set up database and data model
- [x] Move folder open state to URL
- [x] Add auth
- [x] Add file uploading
- [x] Add analytics
- [ ] Add search bar for folders and files
- [ ] Add error for creating folder with same name as one in current directory

## NOTES FOR PRODUCTION APP

- Add separate Clerk keys for dev and production
- Setup app in Google or whatever other auth provider you're using
- Because in dev mode, everything is sent over to Clerk servers

## More TODO

### Folder deletion
Make sure to fetch all of the folders that have it as a parent, and their children too.

Collect all of the things that need to be deleted, going down and then deleting them all at once.
