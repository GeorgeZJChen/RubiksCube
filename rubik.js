(function(){

  var control_area = document.getElementById('rotate_control_area');
  var control_button = document.getElementById('rotate_control_button');
  var control_layer_button = document.getElementById('rotate_layer_control_button');

  var id_prefix = 'isb9qalC_'
  var translations = [
                        [-1, -1, 1], //1
                        [0, -1, 1],
                        [1, -1, 1],
                        [-1, 0, 1],
                        [0, 0, 1], //5
                        [1, 0, 1],
                        [-1, 1, 1],
                        [0, 1, 1],
                        [1, 1, 1],
                        [-1, -1, -1], //10
                        [0, -1, -1],
                        [1, -1, -1],
                        [-1, -1, 0],
                        [0, -1, 0],
                        [1, -1, 0], //15
                        [1, 0, 0],
                        [1, 0, -1],
                        [1, 1, 0],
                        [1, 1, -1],
                        [-1, 0, -1], //20
                        [0, 0, -1],
                        [-1, 1, -1],
                        [0, 1, -1],
                        [-1, 1, 0],
                        [0, 1, 0], //25
                        [-1, 0, 0],
                    ]
  var origins = [
                  [60, 60, -40,], //1
                  [20, 60, -40,],
                  [-20, 60, -40,],
                  [60, 20, -40,],
                  [20, 20, -40,], //5
                  [-20, 20, -40,],
                  [60, -20, -40,],
                  [20, -20, -40,],
                  [-20, -20, -40,],
                  [60, 60, 40,], //10
                  [20, 60, 40,],
                  [-20, 60, 40,],
                  [60, 60, 0,],
                  [20, 60, 0,],
                  [-20, 60, 0,], //15
                  [-20, 20, 0,],
                  [-20, 20, 40,],
                  [-20, -20, 0,],
                  [-20, -20, 40,],
                  [60, 20, 40,], //20
                  [20, 20, 40,],
                  [60, -20, 40,],
                  [20, -20, 40,],
                  [60, -20, 0,],
                  [20, -20, 0,], //25
                  [60, 20, 0,],
                ]
  var state = []
  for (var i = 1; i <= 26; i++) {
    state[i-1] = i
  }

  document.getElementById('random_rotate').addEventListener('click', function(){
    rotate_cubies(['x','y','z'][Math.floor(Math.random()*3)],
    Math.floor(Math.random()*3)+1, Math.floor(Math.random()*2))
    // rotateArray(state, Math.floor(Math.random()*3)+1, ['x','y','z'][Math.floor(Math.random()*3)], Math.floor(Math.random()*2))
    return
  })
  document.getElementById('random_rotate_2').addEventListener('click', function(){
    rotate_position(['x','y','z'][Math.floor(Math.random()*3)],
    Math.floor(Math.random()*3)+1, Math.floor(Math.random()*2))
    // rotateArray(state, Math.floor(Math.random()*3)+1, ['x','y','z'][Math.floor(Math.random()*3)], Math.floor(Math.random()*2))
    return
  })
  document.getElementById('random_rotate_2').addEventListener('mousedown', function(){
    var go = undefined
    var mouseup = function(){
      go = false
      document.removeEventListener('mouseup', mouseup)
    }
    document.addEventListener('mouseup', mouseup)
    ;(function(){
      if(go==undefined){
        go = true
        setTimeout(arguments.callee, 300)
      }
      if(go == false) return
      rotate_position(['x','y','z'][Math.floor(Math.random()*3)],
      Math.floor(Math.random()*3)+1, Math.floor(Math.random()*2))
      setTimeout(arguments.callee, 200)
    })()
    // rotateArray(state, Math.floor(Math.random()*3)+1, ['x','y','z'][Math.floor(Math.random()*3)], Math.floor(Math.random()*2))
    return
  })
  document.getElementById('random_rotate_2').addEventListener('touchstart', function(){
    var go = undefined
    var mouseup = function(){
      go = false
      document.removeEventListener('touchend', mouseup)
    }
    document.addEventListener('touchend', mouseup)
    ;(function(){
      if(go==undefined){
        go = true
        setTimeout(arguments.callee, 300)
      }
      if(go == false) return
      rotate_position(['x','y','z'][Math.floor(Math.random()*3)],
      Math.floor(Math.random()*3)+1, Math.floor(Math.random()*2))
      setTimeout(arguments.callee, 200)
    })()
    // rotateArray(state, Math.floor(Math.random()*3)+1, ['x','y','z'][Math.floor(Math.random()*3)], Math.floor(Math.random()*2))
    return
  })


  var cubies = document.getElementsByClassName('cubie')
  var selected_ids = []
  for (var i = 0; i < cubies.length; i++) {
    cubies[i].addEventListener('mousedown', function(e){
      var cubie = this
      selected_ids = []
      if(cubie.className.indexOf('cubie-selected')==-1){
        cubie.className += ' cubie-selected'
        var id = parseInt(cubie.id.split('_')[1])
        selected_ids.push(id)
        var mup = function(e){

          for (var k = 0; k < selected_ids.length; k++) {
            var _cubie = document.getElementById(id_prefix+selected_ids[k])
            _cubie.className = _cubie.className.replace(' cubie-selected', '')
          }
          selected_ids = []
          document.removeEventListener('mouseup', mup)
        }
        document.addEventListener('mouseup', mup)
      }
    })
    cubies[i].addEventListener('mouseenter', function(e){
      if(selected_ids.length>0){
        var cubie = this
        if(cubie.className.indexOf('cubie-selected')==-1){
          cubie.className += ' cubie-selected'
          var id = parseInt(cubie.id.split('_')[1])
          selected_ids.push(id)
        }
      }
    })
  }

  var mousedown_1 = function(e){
    var x = e.clientX || e.changedTouches[0].clientX,
        y = e.clientY || e.changedTouches[0].clientY;
    var a = control_layer_button;
    var top = a.offsetTop
    var left = a.offsetLeft
    var real_top = 0;
    var real_left = 0;
    while(a != document.body){
      real_left += a.offsetLeft;
      real_top += a.offsetTop;
      a = a.parentNode;
    }

    var stalls = document.getElementById('rotate_layer_control').getElementsByClassName('stall')
    var stalls_pos = [[],[],[],[]]
    for (var i = 0; i < stalls.length; i++) {
      stalls_pos[i][0] = stalls[i].offsetLeft
      stalls_pos[i][1] = stalls[i].offsetTop
    }
    var moved = false;
    var stage_1 = 'unset'
    var stage_2 = 'unset'
    var deltaX
    var deltaY
    var direction
    var axis
    var which

    var move = function (e) { //mousemove
      var mx = e.clientX || e.changedTouches[0].clientX,
          my = e.clientY || e.changedTouches[0].clientY;
      if(!moved&&Math.abs(mx-x)<3&&Math.abs(my-y)<3) return;

      deltaX = mx-x
      deltaY = my-y
      if(deltaX>0)
      deltaX = Math.min(deltaX, 50)
      else
      deltaX = Math.max(deltaX, -50)
      if(deltaY>0)
      deltaY = Math.min(deltaY, 50)
      else
      deltaY = Math.max(deltaY, -50)

      if(stage_1=='unset'){
        if(Math.abs(deltaX)>Math.abs(deltaY)){
          stage_1 = 'x'
        }else {
          stage_1 = 'y'
        }
      }
      if(stage_1 == 'x'){
        if(Math.abs(deltaX)<20&&Math.abs(deltaY)<20){
          stage_1 = 'unset'
        }else {
          deltaY = 0
        }
      }else if (stage_1 == 'y') {
        if(Math.abs(deltaY)<20&&Math.abs(deltaX)<20){
          stage_1 = 'unset'
        }else {
          deltaX = 0
        }
      }

      if(stage_2 == 'unset'){
        if(Math.abs(deltaX)>=50){
          if(deltaX>=0){
            stage_2 = 'x-3'
          }else if(deltaX<0){
            stage_2 = 'x-1'
          }
        }else if (Math.abs(deltaY)>=50) {
          if(deltaY>=0){
            stage_2 = 'y-3'
          }else if(deltaY<0){
            stage_2 = 'y-1'
          }
        }
      }else {
        deltaX = mx-x
        deltaY = my-y
        if(deltaX>0)
        deltaX = Math.min(deltaX, 50)
        else
        deltaX = Math.max(deltaX, -50)
        if(deltaY>0)
        deltaY = Math.min(deltaY, 50)
        else
        deltaY = Math.max(deltaY, -50)
        if(stage_2.indexOf('x')!=-1){
          if(Math.abs(deltaY)<10&&Math.abs(deltaX)<45){
            stage_2 = 'unset'
          }
        }else {
          if(Math.abs(deltaX)<10&&Math.abs(deltaY)<45){
            stage_2 = 'unset'
          }
        }
        if(stage_2 == 'x-3'){
          deltaX = 50
        }else if (stage_2 == 'x-1') {
          deltaX = -50
        }else if (stage_2 == 'y-1') {
          deltaY = -50
        }else if (stage_2 == 'y-3') {
          deltaY = 50
        }
      }
      if(stage_2=='unset'){
        stalls[0].style.left = stalls_pos[0][0] +deltaX +'px'
        stalls[1].style.top = stalls_pos[1][1] +deltaY +'px'
      }else {
        if(stage_1=='x')
          stalls[0].style.left = stalls_pos[0][0] + deltaX +'px'
        else
          stalls[1].style.top = stalls_pos[1][1] + deltaY +'px'
      }

      var s = [left + deltaX, top + deltaY]

      control_layer_button.style.top = s[1] +'px'
      control_layer_button.style.left = s[0] +'px'

      var _axis
      var _which
      if(stage_2!='unset'){
        if(stage_1=='x'&&Math.abs(deltaY)<20){
          _axis = 'y'
          if(deltaX>0)
            direction = true
          else direction = false
          _which = 2
        }else if (stage_1=='y'&&Math.abs(deltaX)<20) {
          _axis = 'x'
          if(deltaY<0)
            direction = true
          else direction = false
          _which = 2
        } else {
          _axis = stage_2.split('-')[0]
          _which = stage_2.split('-')[1]
          if(stage_1=='x'){
            if(deltaY<0)
              direction = true
            else direction = false
          }else if (stage_1=='y') {
            if(deltaX>0)
              direction = true
            else direction = false
          }
        }
        if(_axis!=axis||_which!=which){
          axis = _axis
          which = _which
          var cubies = document.getElementsByClassName('cubie')
          for (var i = 0; i < cubies.length; i++) {
            cubies[i].className = cubies[i].className.replace(' cubie-selected', '')
          }
          cubies = new Array()
          var rp = rotate_position(axis, which, true, true)
          var ids = select_cubies(rp[0], rp[1], true)
          if(ids[ids.length-1]==undefined) ids.pop()
          for (var k = 0; k < ids.length; k++) {
            if(ids[k]==undefined) break
            cubies.push(document.getElementById(id_prefix+(state[ids[k]])))
          }
          for (var i = 0; i < cubies.length; i++) {
            if(cubies[i]&&cubies[i].className.indexOf('cubie-selected')==-1){
              cubies[i].className += ' cubie-selected'
            }
          }
        }
      }else {
        axis = undefined
        which = undefined
        direction = undefined
        selected_cubies = []
      }
      moved = true;
    };
    var up = function (e) {
      stalls[0].removeAttribute('style')
      stalls[1].removeAttribute('style')
      document.removeEventListener("mousemove", move, false);
      document.removeEventListener("mouseup", up, false);
      document.removeEventListener("touchmove", move, false);
      document.removeEventListener("touchend", up, false);
      control_layer_button.removeAttribute('style')
      moved = false;
      var cubies = document.getElementsByClassName('cubie')
      for (var i = 0; i < cubies.length; i++) {
        cubies[i].className = cubies[i].className.replace(' cubie-selected', '')
      }
      if(axis&&which){
        if(rotating) return
        rotating = true
        rotate_position(axis, which, direction)
      }
    };
    document.addEventListener("mousemove", move, false);
    document.addEventListener("mouseup", up, false);
    document.addEventListener("touchmove", move, false);
    document.addEventListener("touchend", up, false);
  }

  control_layer_button.addEventListener('mousedown', mousedown_1)
  control_layer_button.addEventListener('touchstart', mousedown_1)

  control_button.addEventListener('dblclick', function(e){
    var rubik = document.getElementById('rubiks_cube');
    rubik.style.transform = "rotateX("+ -9.5 +"deg) rotateY("+ -25 +"deg)";
  })

  var mousedown_2 = function(e){
    var x = e.clientX || e.changedTouches[0].clientX,
        y = e.clientY || e.changedTouches[0].clientY;
    var a = control_area;
    var top = 0;
    var left = 0;
    while(a != document.body){
      left += a.offsetLeft;
      top += a.offsetTop;
      a = a.parentNode;
    }
    var b = control_button;
    var btn_left = 0;
    var btn_top = 0;
    while(b != document.body){
      btn_left += b.offsetLeft;
      btn_top += b.offsetTop;
      b = b.parentNode;
    }
    center = [left + control_area.offsetHeight/2-1, top + control_area.offsetWidth/2-1];

    control_button.style.left = x-left -26 +'px';
    control_button.style.top = y-top -26 +'px';
    control_button.style.width = '30px';
    control_button.style.height = '30px';

    var moved = false;
    var velocity_x = 0;
    var velocity_y = 0;
    var go = false;
    var rotate = function(){
      //transform: rotateX(-19deg) rotateY(-212deg);
      var rubik = document.getElementById('rubiks_cube');
      var transform = rubik.style.transform
      var rotateX = parseInt(transform.match(/rotate[XYZ]\(([^\)]*)deg\)/)[1]);
      var rotateY = parseInt(transform.match(/deg.*rotate[XYZ]\(([^\)]*)deg\)/)[1]);
      rubik.style.transition = "";
      (function(){
        if(go){
          rotateX += velocity_y *3;
          rotateY += velocity_x *3;
          rubik.style.transform = "rotateX("+ rotateX.toFixed(2) +"deg) rotateY("+ rotateY.toFixed(2) +"deg)"
          setTimeout(arguments.callee, 20)
        }
      })()

    }
    var move = function (e) { //mousemove
      var mx = e.clientX || e.changedTouches[0].clientX,
          my = e.clientY || e.changedTouches[0].clientY;
      if(!moved&&Math.abs(mx-x)<3&&Math.abs(my-y)<3) return;

      button_pos = [mx-8, my-8];

      var r = control_area.offsetHeight/2-1;
      var k = (button_pos[1]-center[1])/(button_pos[0]-center[0]);
      var v_x = Math.sqrt(r*r/(k*k+1));
      if(button_pos[0]<center[0])
        v_x = -v_x;
      var v_y = k*v_x;
      if(k==Infinity){
        v_x = 0;
        v_y = r
      }else if (k==-Infinity) {
        v_x = 0;
        v_y = -r
      }

      distance = Math.sqrt(Math.pow(button_pos[0]-center[0], 2) + Math.pow(button_pos[1]-center[1], 2))
      if(v_x==0)
        velocity_x = 0
      else
        velocity_x = Math.tan(1.2*Math.min(distance, r)/r*v_x/r)/2;
      if(v_y==0)
        velocity_y = 0
      else
        velocity_y = -Math.tan(1.2*Math.min(distance, r)/r*v_y/r)/2;

      if(isNaN(velocity_x)) velocity_x = 0
      if(isNaN(velocity_y)) velocity_y = 0
      if(!go){
        go = true;
        rotate()
      }

      if(!(distance >= r)){
        control_button.style.left = mx-left -22 +'px';
        control_button.style.top = my-top -22 +'px';
      }else {
        control_button.style.left = r + v_x -14 +'px';
        control_button.style.top = r + v_y -14 +'px';
      }
      moved = true;
    };
    var up = function (e) {
      document.removeEventListener("mousemove", move, false);
      document.removeEventListener("mouseup", up, false);
      document.removeEventListener("touchmove", move, false);
      document.removeEventListener("touchend", up, false);
      control_button.removeAttribute('style');
      moved = false;
      go = false;
    };
    document.addEventListener("mousemove", move, false);
    document.addEventListener("mouseup", up, false);
    document.addEventListener("touchmove", move, false);
    document.addEventListener("touchend", up, false);

    if(Math.pow(x-left -26-btn_left, 2) + Math.pow(y-top -26-btn_top, 2) > 400){
      moved = true;
      move(e)
    }
  }
  control_area.addEventListener('mousedown', mousedown_2)
  control_area.addEventListener('touchstart', mousedown_2)

  var rotating = false
  var rotate_cubies = function(axis, which, direction){
    if(rotating) return
    rotating = true
    rotate_position(axis, which, direction)
  }
  var rotate_position = function(axis, which, direction, position_only){

    get_current_position()
    var axes = ['x', 'y', 'z']
    var p
    for (var i = 0; i < 3; i++) {
      if(position[i][0] == axis){
        p = i
        break
      }
    }
    var pos_direction = position[p][1]
    if(pos_direction != 1){
      direction = !direction
      if(which == 1) which = 3
      else if(which == 3) which = 1
    }
    axis = axes[p]
    if(position_only) return [axis, which, direction];
    rotateArray(state, which, axis, direction)
  }
  var rotateArray = function(state, which, axis, direction){

    var cubies_a = select_cubies(axis, which, direction)
    tup = [cubies_a.slice(0,4), cubies_a.slice(4,8)]
    var extra = cubies_a.pop()


    var ids = [];
    for (var k = 0; k < 2; k++) {
      var arr = tup[k]
      var temp = state[arr[0]]
      state[arr[0]] = state[arr[1]]
      state[arr[1]] = state[arr[2]]
      state[arr[2]] = state[arr[3]]
      state[arr[3]] = temp
      for (var i = 0; i < arr.length; i++) {
        ids[ids.length] = state[arr[i]]
      }
    }
    if(extra != undefined)
      ids[ids.length] = state[extra]

    if(axis == 'x')
      axis_n = '1,0,0'
    else if (axis == 'y')
      axis_n = '0,1,0'
    else if (axis == 'z')
      axis_n = '0,0,1'
    var dir_n
    if(direction) dir_n = ',90deg'
    else dir_n = ',-90deg'

    var cubies = [];
    for (var i = 0; i < ids.length; i++) {
      cubies[i] = document.getElementById(id_prefix+ids[i])
    }
    for (var i = 0; i < cubies.length; i++) {
      var style = cubies[i].getAttribute('style').replace(/rotate3d[^;]*/, 'rotate3d('+axis_n+dir_n+')')
      cubies[i].setAttribute('style', style)
    }
    setTimeout(function(){
      var setTimeout_p = function(p){
        setTimeout(function(){
          p.style.transition = ''
          rotating = false
        },30)
      }
      for (var i = 0; i < cubies.length; i++) {
        var translate = translations[state.indexOf(ids[i])].slice()
        var origin = origins[state.indexOf(ids[i])].slice()
        for (var j = 0; j < 3; j++) {
          translate[j] = translate[j]*40 + 'px'
          origin[j] = origin[j] + 'px'
        }
        cubies[i].setAttribute('style', 'transform:translate3d('+translate.join(',')+')rotate3d(0,0,0,0deg);transform-origin:'+origin.join(' ')+';transition:no')

        //faces turning
        var turn;
        if(axis == 'x')
          turn = [1,2,4,5]
        else if (axis == 'y')
          turn = [1,3,4,6]
        else if (axis == 'z')
          turn = [2,3,5,6]
        if(!direction)
          turn.reverse()

        var faces = cubies[i].children[0].children
        var temp_class = faces[turn[3]-1].className
        var temp_html = faces[turn[3]-1].innerHTML
        for (var m = 3; m >=1; m--) {
          var a = faces[turn[m]-1]
          var b = faces[turn[m-1]-1]
          faces[turn[m]-1].className = faces[turn[m-1]-1].className
          faces[turn[m]-1].innerHTML = faces[turn[m-1]-1].innerHTML
        }
        faces[turn[0]-1].className = temp_class
        faces[turn[0]-1].innerHTML = temp_html

        setTimeout_p(cubies[i])
      }

    },650)
    return state
  }
  var position = [[],[],[]]
  var get_current_position = function(){
    var rubik = document.getElementById('rubiks_cube');
    var transform = rubik.style.transform
    var rotateX = parseInt(transform.match(/rotate[XYZ]\(([^\)]*)deg\)/)[1]);
    var rotateY = parseInt(transform.match(/deg.*rotate[XYZ]\(([^\)]*)deg\)/)[1]);
    var cos_a = Math.cos((rotateX % 360)*Math.PI/180)
    var sin_a = Math.sin((rotateX % 360)*Math.PI/180)
    var cos_0 = Math.cos((rotateY % 360)*Math.PI/180)
    var sin_0 = Math.sin((rotateY % 360)*Math.PI/180)
    // rotate X:
    var vec_x = [1,0,0]
    var vec_y = [0, cos_a, sin_a]
    var vec_z = [0, -sin_a, cos_a]
    var rotation_matrix_y = []
    rotation_matrix_y[0] = [cos_0, sin_a*sin_0, -cos_a*sin_0]
    rotation_matrix_y[1] = [sin_a*sin_0, cos_0+cos_a*cos_a*(1-cos_0), cos_a*sin_a*(cos_0)]
    rotation_matrix_y[2] = [-cos_a*sin_0, sin_a*cos_a*(1-cos_0), cos_0+sin_a*sin_a*(1-cos_0)]

    var product = function(vec){
      var p = [0,0,0]
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          p[i]+= vec[j]*rotation_matrix_y[i][j]
        }
      }
      return p
    }
    // rotateY:
    vec_x = product(vec_x)
    vec_z = product(vec_z)
    vec_z[0] *= -1  //adjust matrix

    var cosine = function(v1, v2){
      var product = 0
      for (var i = 0; i < v1.length; i++) {
        product += v1[i] * v2[i]
      }
      var modulus1 = 0
      var modulus2 = 0
      for (var i = 0; i < v1.length; i++) {
        modulus1 += v1[i] * v1[i]
        modulus2 += v2[i] * v2[i]
      }
      return product/(modulus1*modulus2)
    }
    var vectors = [[1,0,0],[0,1,0],[0,0,1],[-1,0,0],[0,-1,0],[0,0,-1]]

    var axes = ['x', 'y', 'z']
    var three_vecs = [vec_x, vec_y, vec_z]
    var marks = []
    for (var m = 0; m < 3; m++) {
      var vec_m = three_vecs[m]
      var mark = []
      for (var i = 0; i < vectors.length; i++) {
        var t= cosine(vec_m, vectors[i])
        if(t>0)
          mark.push([t,i])
      }
      mark.sort(function(a,b){return b[0]-a[0]})
      marks.push(mark.slice())
    }
    var temp
    var change_n
    for (var n = 0; n < marks.length; n++) {
      if(marks[n][0][1] == temp){
        if(marks[n][0][0]>marks[n-1][0][0])
          change_n = n-1
        else
          change_n = n
        break
      }
      temp = marks[n][0][1]
    }
    for (var k = 0; k < 3; k++) {
      if(k!=change_n)
        var vec = vectors[marks[k][0][1]]
      else
        var vec = vectors[marks[k][1][1]]
        for (var i = 0; i < 3; i++) {
          if(vec[i]!=0){
            position[k][0] = axes[i]
            position[k][1] = vec[i]
            break
          }
        }
    }
  }
  var select_cubies = function(axis, which, direction){
    if(direction) direction = 1
    else direction = 0
    var dict = {
      'x': [
        [9,21,6,0, 12,19,23,3, 10,22,7,1, 13,20,24,4, 11,18,8,2, 14,16,17,5],
        [0,6,21,9, 3,23,19,12, 1,7,22,10, 4,24,20,13, 2,8,18,11, 5,17,16,14]
      ],
      'y': [
        [0,2,11,9, 1,14,10,12, 3,5,16,19, 4,15,20,25, 6,8,18,21, 7,17,22,23],
        [9,11,2,0, 12,10,14,1, 19,16,5,3, 25,20,15,4, 21,18,8,6, 23,22,17,7]
      ],
      'z': [
        [9,11,18,21, 19,10,16,22, 12,14,17,23, 25,13,15,24, 0,2,8,6, 3,1,5,7],
        [21,18,11,9, 22,16,10,19, 23,17,14,12, 24,15,13,25, 6,8,2,0, 7,5,1,3]
      ]
    }

    var whole = dict[axis][direction]

    var arr = whole.slice(which*8-8, which*8)
    var extra
    if(axis == 'x')
      if (which == 1) extra = 25
      else extra = 15
    else if (axis == 'y')
      if (which == 1) extra = 13
      else extra = 24
    else if (axis == 'z')
      if (which == 1) extra = 20
      else extra = 4
    if(which == 2)
      extra = undefined
    arr.push(extra)
    return arr
  }

})()
