require('dotenv').config()
const { app, BrowserWindow, dialog, ipcMain} = require('electron')
const url = require('url')
const path = require('path')
const child_process = require('child_process');

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();

const binariesPath =
  IS_PROD && app.isPackaged
    ? path.join(process.resourcesPath, './bin')
    : path.join(root, './resources', './bin');

const executable = path.join(binariesPath, "S3DownloadClient.jar "); 

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadURL(url.format ({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// listener to pick the date
ipcMain.on("object-date",(e, date)=>{
  console.log("is prod", IS_PROD);
  console.log("executable",executable);
  run_script("java -jar " + executable +date)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function run_script(command, args) {
  dialog.showMessageBox({
    title: 'S3DonwloadClient',
    type: 'info',
    message: 'Your download is in progress.\r\n'
  });
    var child = child_process.spawn(command, args, {
        encoding: 'utf8',
        shell: true
    });
    // You can also use a variable to save the output for when the script closes later
    child.on('error', (error) => {
        dialog.showMessageBox({
            title: 'S3DonwloadClient',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        //Here is the output
        data=data.toString();   
        console.log(data);      
    });

    child.on('close', (code) => {
        //Here you can get the exit code of the script  
        switch (code) {
            case 0:
                dialog.showMessageBox({
                    title: 'S3DonwloadClient',
                    type: 'info',
                    message: 'End process.\r\n'
                });
                break;
        }

    });

}