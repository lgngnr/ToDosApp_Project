const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', ()=>{
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    //close app if main windiw closed
    mainWindow.on('closed', () => app.quit());
    //initializate and set menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add new Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
}

ipcMain.on('todo:add', (event, todo)=>{
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

function clearTodos(){
    mainWindow.webContents.send('todo:clear', true);
}

/* Menu template, 
structure how appear on the screen
it's an array containing one 
object for each menu dropdown
*/
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'new Todo',
                click(){ createAddWindow(); }
            },
            { 
                label: 'clear',
                click(){ clearTodos() }
            },
            { 
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform === 'darwin'){
    // unshift take the argument and insert it at the virst element of ana rray
    // pass an empty object to visualize prperly on mac os
    menuTemplate.unshift({});
}

//open developer tools if not production enviroment
if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            // preset options
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools(); 
                }
            }
        ]
    });
}