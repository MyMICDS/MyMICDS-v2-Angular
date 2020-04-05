# Having Trouble running `npm start`? Follow these steps

## General Troubleshooting
- run `npm install`
- Download and install [NVM (Node Version Manager)](https://github.com/creationix/nvm) or [NVM for Windows](https://github.com/coreybutler/nvm-windows)


## Error `cb() never called!`

## Error `Could not install from "..\MyMICDS-SDK" as it does not contain a package.json file.`

Ensure you have all three repos `MyMICDS-v2-Angular`, `MyMICDS-SDK`, and `MyMICDS-v2` installed to the same folder meaning your hiearchy should look like this:
```
Folder
|-- MyMICDS-v2-Angular
|-- MyMICDS-SDK
|-- MyMICDS-v2
```

## Error `errno: -4048 code: 'EPERM' syscall: 'unlink'`
