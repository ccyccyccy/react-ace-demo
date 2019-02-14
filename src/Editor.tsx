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

  get(url: string, callback: (data: JSONData) => void){
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        callback(JSON.parse(xmlhttp.responseText));
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  componentDidMount() {
    // as any to bypass typescript type checking. might not need in later version if react-ace supports typescript
    // this editor is the same as the one in line 5 of index.js of sharedb-ace-example 
    let editor = (this.refs.aceContainer as any).editor
    const session = editor.getSession();
    this.get("http://localhost:3000/gists/latest", function(data: JSONData) {
      const ShareAce = new sharedbAce(data.id, {
        WsUrl: "ws://localhost:3000/ws",
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
  }
}

const handlers = {
  goGreen: () => {}
}

export default Editor;
