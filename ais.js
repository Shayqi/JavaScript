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
    for(let i=0;i<15;i++){
      context.moveTo(15+i*30,15);
      context.lineTo(15+i*30,435);
      context.stroke();
      context.moveTo(15,15+i*30);
      context.lineTo(435,15+i*30);
      context.stroke();
    }
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
    context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
    context.closePath();
    let gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,
      15+i*30+2,15+j*30-2,0);
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
      y=e.offsetY;
    let i=Math.floor(x/30),
      j=Math.floor(y/30);
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
              if(myWin[k]==1) myScore[i][j]+=100;
              else if(myWin[k]==2) myScore[i][j]+=200;
              else if(myWin[k]==3){
                if(pcWin[k]!=0) myScore[i][j]+=1200;
                else myScore[i][j] +=5000;
              }
              else if(myWin[k]==4) myScore[i][j]+=10000;
              if(pcWin[k]==1) pcScore[i][j]+=220;
              else if(pcWin[k]==2) pcScore[i][j]+=420;
              else if(pcWin[k]==3){
                if(myWin[k]!=0) pcScore[i][j]+=1000;
                else pcScore[i][j] +=2000;
              }
              else if(pcWin[k]==4) pcScore[i][j]+=20000;
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
