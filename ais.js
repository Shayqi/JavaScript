(function(){
  let chess=document.getElementById('chess'),
    context=chess.getContext('2d'),
    me=true,chessBoard=[],
    wins=[],count=0,over=false, //贏法數組
    myWin=[],pcWin=[];
  function initialization(){
    for(let i=0;i<count;i++){
      myWin[i]=0;
      pcWin[i]=0;
    }
  }
  
  function drawChessBoard(){
    context.strokeStyle='#bfbfbf';
    for(let i=0;i<15;i++){
      context.moveTo(15+i*30,15);
      context.lineTo(15+i*30,435);
      context.stroke();
      context.moveTo(15,15+i*30);
      context.lineTo(435,15+i*30);
      context.stroke();
    }
  }
  drawChessBoard();
  function chessRuleA(){
    for(let i=0;i<15;i++){
      chessBoard[i]=[];
      wins[i]=[];
      for(let j=0;j<15;j++){
        chessBoard[i][j]=0;
        wins[i][j]=[];
      }
    }
  }
  chessRuleA();
  function winsRuleA(){
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
  }
  winsRuleA();
  initialization();
  
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
  
  chess.onclick=function(e){
    if(over){
      return;
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
            alert('You win!!');
            over=true;
          }
        }
      }
      if(!over){
        me = !me;
        computerAI();
      }
    }
  };
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
              if(myWin[k]==1) myScore[i][j]+=200;
              else if(myWin[k]==2) myScore[i][j]+=400;
              else if(myWin[k]==3) myScore[i][j]+=2000;
              else if(myWin[k]==4) myScore[i][j]+=10000;
              if(pcWin[k]==1) pcScore[i][j]+=420;
              else if(pcWin[k]==2) pcScore[i][j]+=640;
              else if(pcWin[k]==3) pcScore[i][j]+=3100;
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
          alert('Computer win!!');
          over=true;
        }
      }
    }
    if(!over)me=!me;
  }
}());