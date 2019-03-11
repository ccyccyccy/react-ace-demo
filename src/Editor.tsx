import React from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import sharedbAce from "sharedb-ace";
import { HotKeys } from 'react-hotkeys'

import 'brace/mode/javascript';
import 'brace/theme/cobalt';

export interface JSONData {
    id: number;
}

class Editor extends React.Component {
    
  private id: string;

  private get(url: string, callback: (data: JSONData) => void){
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        callback(JSON.parse(xmlhttp.responseText));
        console.log(JSON.parse(xmlhttp.responseText).id);
        this.id = JSON.parse(xmlhttp.responseText).id;
        console.log("ID = " + JSON.parse(xmlhttp.responseText).id);
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  public componentDidMount() {
    // as any to bypass typescript type checking. might not need in later version if react-ace supports typescript
    // this editor is the same as the one in line 5 of index.js of sharedb-ace-example 
    let editor = (this.refs.aceContainer as any).editor
    const session = editor.getSession();
    let url;

    //this.id = "8c951f40-43dc-11e9-b2ac-c9cd9b480d09";
    if (this.id == null) {
        console.log("latest");
        url = "http://localhost:4000/gists/latest";
    } else {
        console.log("id");
        url = "http://localhost:4000/gists/" + this.id;
    }

    this.get(url, function(data: JSONData) {
      const ShareAce = new sharedbAce(data.id, {
        WsUrl: "ws://localhost:4000/ws",
        pluginWsUrl: "ws://localhost:3108/ws",
        namespace: "codepad",
      });
      ShareAce.on('ready', function() {
        ShareAce.add(editor, ["code"], [
          // SharedbAceRWControl,
          // SharedbAceMultipleCursors
        ]);
      });
    })

    console.log("1ID = " + this.id);
  }

  // Render editor
  public render() {
    return (
	<HotKeys className="Editor" handlers={handlers}>
        <div className="row editor-react-ace">
		<AceEditor
      		mode="javascript"
      		theme="cobalt"
      		name="UNIQUE_ID_OF_DIV"
      		ref="aceContainer"
      		editorProps={{$blockScrolling: Infinity}}
    	/>
        </div>
    </HotKeys>
    )
    console.log("2ID = " + this.id);
  }
}

const handlers = {
  goGreen: () => {}
}

export default Editor;
