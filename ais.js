(function(){
  let chess,
    context,
    me,chessBoard=[],
    wins,count,over, //贏法數組
    myWin,pcWin,
    w=document.getElementById('w'),wc=0,lc=0,
    l=document.getElementById('l');
  function initialization(){
    let reset=document.getElementById('box');
    reset.innerHTML='<canvas width="450px" height="450px" id="chess"></canvas>';
    chess=document.getElementById('chess');
    context=chess.getContext('2d');
    context.strokeStyle='#bfbfbf';
    me=true;chessBoard=[];
    wins=[];count=0;over=false; //贏法數組
    myWin=[];pcWin=[];
    
    function setMobile(){
      let box=document.getElementById('box'),
        w=window.innerWidth, h=window.innerHeight;
      box.style.height=h*2+'px';
      window.scrollTo(0,1);
      h=window.innerHeight+2;
      box.style.height=h+'px';
      box.style.width=w+'px';
      box.style.padding=0;
      if(screen.width<=375) draw(15,15,24);
      else if(screen.width>375 && screen.width<=768) draw(15,15,30);
      else draw(15,15,30);
    }
    function draw(x,y,gap){
      //x=15,y=15,gap=30
      for(let i=0;i<15;i++){
        context.moveTo(x+i*gap,y);
        context.lineTo(x+i*gap,gap*y-y);
        context.stroke();
        context.moveTo(x,y+i*gap);
        context.lineTo(gap*x-x,y+i*gap);
        context.stroke();
      }
    }
    setMobile();
    
    for(let i=0;i<15;i++){
      chessBoard[i]=[];
      wins[i]=[];
      for(let j=0;j<15;j++){
        chessBoard[i][j]=0;
        wins[i][j]=[];
      }
    }
    //直線贏法
    for(let i=0;i<15;i++){
      for(let j=0;j<11;j++){
        for(let k=0;k<5;k++) wins[i][j+k][count]=true;
        count++;
      }
    }
    //橫線贏法
    for(let i=0;i<15;i++){
      for(let j=0;j<11;j++){
        for(let k=0;k<5;k++) wins[j+k][i][count]=true;
        count++;
      }
    }
    //反斜線贏法
    for(let i=0;i<11;i++){
      for(let j=0;j<11;j++){
        for(let k=0;k<5;k++) wins[i+k][j+k][count]=true;
        count++;
      }
    }
    //斜線
    for(let i=0;i<11;i++){
      for(let j=14;j>3;j--){
        for(let k=0;k<5;k++) wins[i+k][j-k][count]=true;
        count++;
      }
    }
    for(let i=0;i<count;i++){
      myWin[i]=0;
      pcWin[i]=0;
    }
    chess.onclick=myClick;
  }
  
  
  function oneStep(i,j,me){
    context.beginPath();
    if(screen.width<=375){
      context.arc(15+i*24,15+j*24,10,0,2*Math.PI);
    }else context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
    context.closePath();
    let gradient;
    if(screen.width<=375){
      gradient=context.createRadialGradient(15+i*24+2,15+j*24-2,10,
        15+i*24+2,15+j*24-2,0);
    }else{
      gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,
        15+i*30+2,15+j*30-2,0);
    }
    if(me){
      gradient.addColorStop(0,'#0a0a0a');
      gradient.addColorStop(1,'#636766');
    }else{
      gradient.addColorStop(0,'#d1d1d1');
      gradient.addColorStop(1,'#f9f9f9');
    }
    context.fillStyle=gradient;
    context.fill();
  }
  initialization();
  function myClick(e){
    if(over){
      if(confirm('重新開始嗎?')){
        initialization();
        return;
      }else return;
    }
    if(!me){
      return;
    }
    let x=e.offsetX,
      y=e.offsetY,
    i, j;
    if(screen.width<=375){
      i=Math.floor(x/24);
      j=Math.floor(y/24);
    }else{
      i=Math.floor(x/30);
      j=Math.floor(y/30);
    }
    if(chessBoard[i][j]==0){
      oneStep(i,j,me);
      chessBoard[i][j]=1;
      for(let k=0;k<count;k++){
        if(wins[i][j][k]){
          myWin[k]++;
          pcWin[k]=6;
          if(myWin[k]==5){
            alert('恭喜，你贏了!!\n再點擊一下可重新開始');
            over=true;
            wc++;
            w.innerHTML=wc;
          }
        }
      }
      if(!over){
        me = !me;
        setTimeout(computerAI,Math.random()*1500+300);
      }
    }
  }
  function computerAI(){
    let myScore=[],
      pcScore=[],
      max=0,x=0,y=0;
    for(let i=0;i<15;i++){
      myScore[i]=[];
      pcScore[i]=[];
      for(let j=0;j<15;j++){
        myScore[i][j]=0;
        pcScore[i][j]=0;
      }
    }
    for(let i=0;i<15;i++){
      for(let j=0;j<15;j++){
        if(chessBoard[i][j]==0){
          for(let k=0;k<count;k++){
            if(wins[i][j][k]){
              if(myWin[k]===1) myScore[i][j]+=100;
              else if(myWin[k]===2){
                if(pcWin[k]!=6) myScore[i][j]+=130;
                else myScore[i][j] +=300;
              }
              else if(myWin[k]===3){
                if(pcWin[k]!=6) myScore[i][j]+=300;
                else myScore[i][j] +=800;
              }
              else if(myWin[k]===4)myScore[i][j]+=3500;
    
              if(pcWin[k]===1) pcScore[i][j]+=110;
              else if(pcWin[k]===2){
                if(myWin[k]!=6) pcScore[i][j]+150;
                else pcScore[i][j] +=350;
              }
              else if(pcWin[k]===3){
                if(myWin[k]!=6) pcScore[i][j]+=500;
                else pcScore[i][j] +=1000;
              }
              else if(pcWin[k]===4){
                if(myWin[k]!=6) pcScore[i][j]+=2800;
                else pcScore[i][j] +=20000;
              }
            }
          }
          if(myScore[i][j]>max){
            max=myScore[i][j];
            x=i;
            y=j;
          }else if(myScore[i][j]==max){
            if(pcScore[i][j]>pcScore[x][y]){
              x=i;
              y=j;
            }
          }
          if(pcScore[i][j]>max){
            max=pcScore[i][j];
            x=i;
            y=j;
          }else if(pcScore[i][j]==max){
            if(myScore[i][j]>myScore[x][y]){
              x=i;
              y=j;
            }
          }
        }
      }
    }
    oneStep(x,y,false);
    chessBoard[x][y]=2;
    for(let k=0;k<count;k++){
      if(wins[x][y][k]){
        pcWin[k]++;
        myWin[k]=6;
        if(pcWin[k]==5){
          alert('遺憾，AI勝利了...\n再點擊一下可重新開始');
          over=true;
          lc++;
          l.innerHTML=lc;
        }
      }
    }
    if(!over)me=!me;
  }
}());
