(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,t,n){e.exports=n(24)},20:function(e,t,n){},24:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(11),o=n.n(l),i=(n(20),n(1)),c=n(2),u=n(5),s=n(3),m=n(6),d=n(7),p=n.n(d),g=n(12),h=n(9),b=n(26),v=function(){return r.a.createElement("div",null,"Loading...")},f=function(e){var t=e.entered_game,n=e.name,a=e.game_id,l=e.onChangeName,o=e.onChangeGameId,i=e.onJoin,c=e.onLogout;return t?r.a.createElement("div",null,"Game ID: ",r.a.createElement("b",null,a),r.a.createElement("br",null),"Your Name: ",r.a.createElement("b",null,n),r.a.createElement("br",null),r.a.createElement("a",{href:"#",onClick:function(){return c()}},"Logout")):r.a.createElement(r.a.Fragment,null,"Your Name: ",r.a.createElement("input",{type:"text",value:n,onChange:function(e){return l(e.target.value)}}),r.a.createElement("br",null),"Join a game: ",r.a.createElement("input",{type:"text",value:a,onChange:function(e){return o(e.target.value)}}),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return i()}},"Join"))},E="ws://127.0.0.1:80",_=function(e){function t(){var e,n;Object(i.a)(this,t);for(var a=arguments.length,r=new Array(a),l=0;l<a;l++)r[l]=arguments[l];return(n=Object(u.a)(this,(e=Object(s.a)(t)).call.apply(e,[this].concat(r)))).ws=new WebSocket(E),n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"reconnect",value:function(){var e=this;return new Promise(function(t,n){console.log("connecting...");var a=new WebSocket(E);a.onopen=function(){console.log("connected"),e.props.entered_game&&e.sendMessage({type:"retrieve_game"}),t()},a.onmessage=function(t){var n=JSON.parse(t.data);console.log(n),e.props.setState(Object(h.a)({},n,{entered_game:!0}))},a.onclose=function(){console.log("disconnected"),setTimeout(e.reconnect.bind(e),1e3)},e.ws=a,e.props.onConnect(e.sendMessage.bind(e))})}},{key:"componentDidMount",value:function(){var e=Object(g.a)(p.a.mark(function e(){var t,n,a;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.reconnect();case 2:t=localStorage.getItem("user_id"),n=localStorage.getItem("name"),a=localStorage.getItem("game_id"),t&&a?(this.props.setState({game_id:a,user_id:t,name:n}),this.sendMessage({type:"retrieve_game"})):this.props.setState({user_id:Object(b.a)()});case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"sendMessage",value:function(e){var t=this.props,n=t.game_id,a=t.user_id,r=t.name;this.ws.send(JSON.stringify(Object(h.a)({},e,{game_id:n,user_id:a,name:r})))}},{key:"join",value:function(){var e=this.props,t=e.name,n=e.game_id,a=e.user_id;localStorage.setItem("user_id",a),localStorage.setItem("game_id",n),localStorage.setItem("name",t),this.sendMessage({type:"new_player",value:t})}},{key:"logout",value:function(){localStorage.removeItem("user_id"),localStorage.removeItem("game_id"),localStorage.removeItem("name"),location.reload()}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"connection"},null===this.props.user_id?r.a.createElement(v,null):r.a.createElement(f,{name:this.props.name,game_id:this.props.game_id,entered_game:this.props.entered_game,onChangeName:function(t){return e.props.setState({name:t})},onChangeGameId:function(t){return e.props.setState({game_id:t})},onJoin:this.join.bind(this),onLogout:this.logout.bind(this)}))}}]),t}(a.Component),S=n(8),y=function(e){var t=e.cards;return r.a.createElement("div",{className:"cards_hand"},t.map(function(e,t){return r.a.createElement(S.a,{key:t,card:(n=e,S.b.filter(function(e){return e.id==n})[0]),size:"small"});var n}))},j=n(4),O=function(e){var t=e.name,n=e.in_play,l=e.onSubmitPrediction,o=Object(a.useState)(null),i=Object(j.a)(o,2),c=i[0],u=i[1];return r.a.createElement("div",{className:"predictions"},t==n?r.a.createElement(r.a.Fragment,null,r.a.createElement("label",null,"Enter the number of tricks you think you will win"),r.a.createElement("br",null),r.a.createElement("input",{value:c,onChange:function(e){return u(parseInt(e.target.value))}}),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return l(c)}},"Submit")):r.a.createElement("span",null,n," is currently predicting their expected number of tricks"))},k=function(e){var t=e.name,n=e.in_play,l=e.onSubmitTrump,o=Object(a.useState)(""),i=Object(j.a)(o,2),c=i[0],u=i[1];return r.a.createElement("div",{className:"predictions"},t==n?r.a.createElement(r.a.Fragment,null,r.a.createElement("label",null,"You picked the highest prediction, please choose the trump suit"),r.a.createElement("br",null),r.a.createElement("select",{value:c,onChange:function(e){return u(e.target.value)}},r.a.createElement("option",{value:""},"Select"),r.a.createElement("option",{value:"C"},"Clubs"),r.a.createElement("option",{value:"H"},"Hearts"),r.a.createElement("option",{value:"D"},"Diamonds"),r.a.createElement("option",{value:"S"},"Spades")),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return l(c)}},"Submit")):r.a.createElement("span",null,n," is currently choosing the trump suit"))},w=function(e){var t=e.mode,n=e.hand,a=e.admin,l=e.onStart,o=e.send,i=function(){return r.a.createElement(r.a.Fragment,null)};return"predictions"==t?i=function(){return r.a.createElement(O,Object.assign({onSubmitPrediction:function(e){return o({type:"submit_prediction",value:e})}},e))}:"choose_trump"==t&&(i=function(){return r.a.createElement(k,Object.assign({onSubmitTrump:function(e){return o({type:"submit_trump",value:e})}},e))}),r.a.createElement("div",{className:"game_play"},0==n.length?a?r.a.createElement("button",{onClick:l},"Start"):r.a.createElement("span",null,"Waiting for game to start..."):r.a.createElement(r.a.Fragment,null,r.a.createElement(y,{cards:n}),r.a.createElement(i,null)))},C=function(e){function t(){var e,n;Object(i.a)(this,t);for(var a=arguments.length,r=new Array(a),l=0;l<a;l++)r[l]=arguments[l];return(n=Object(u.a)(this,(e=Object(s.a)(t)).call.apply(e,[this].concat(r)))).state={players:[],name:null,game_id:null,entered_game:!1,user_id:null,cards_per_hand:null,mode:null,send:null,hand:[],in_play:null,admin:null,predictions:[],trump_suit:null},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"App"},r.a.createElement(_,{name:this.state.name,game_id:this.state.game_id,user_id:this.state.user_id,entered_game:this.state.entered_game,onConnect:function(t){return e.setState({send:t})},setState:this.setState.bind(this)}),this.state.entered_game&&r.a.createElement(w,Object.assign({onStart:function(){return e.state.send({type:"start_game"})}},this.state)))}}]),t}(a.Component);o.a.render(r.a.createElement(C,null),document.getElementById("root"))}},[[15,2,1]]]);
//# sourceMappingURL=main.4f19bf71.chunk.js.map