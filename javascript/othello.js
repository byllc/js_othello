//the size of hte board n x n = SIZE x SIZE
SIZE = 8;

//must be specified as rgb,  there can be no spaces in them
COLOR_PLAYER = "rgb(255,255,255)";
COLOR_OPPONENT = "rgb(0,0,0)";
COLOR_EMPTY = "rgb(6,114,14)"; 

TWO_PLAYER_LOCAL = 1;
TWO_PLAYER_NETWORK = 2;
SINGLE_PLAYER = 3;

//directions about a particular game board cell
NORTH = 0;
NORTHEAST = 1;
EAST = 2;
SOUTHEAST = 3;
SOUTH = 4;
SOUTHWEST = 5;
WEST = 6;
NORTHWEST = 7;
DIRECTIONS = [NORTH,NORTHEAST,EAST,SOUTHEAST,SOUTH,SOUTHWEST,WEST,NORTHWEST];

var game_type = TWO_PLAYER_LOCAL;
var active_color = COLOR_PLAYER;
var flankable_directions = []; //the directions that are flankable for the current piece
var player_score = 0;
var opponent_score = 0;

function create_game_board()
{                 
	 player_score = 2;
	 opponent_score = 2;
	 reset_flankable_directions();      
	 var cells = get_tags_by_class("board_cell","td");
	 for(var i = 0; i < cells.length; i++){
		cells[i].style.backgroundColor = COLOR_EMPTY;
	 }
	 
	$("player_score_label").style.color = COLOR_PLAYER;
	$("opponent_score_label").style.color = COLOR_OPPONENT;
	
	$("messages").style.backgroundColor = COLOR_PLAYER;
	
	display_score();
	
	 //set up initial pieces
	 $("4_4").style.backgroundColor = COLOR_PLAYER;
	 $("4_5").style.backgroundColor = COLOR_OPPONENT;
	 $("5_5").style.backgroundColor = COLOR_PLAYER;
	 $("5_4").style.backgroundColor = COLOR_OPPONENT;
	
} 

//skips a players turn without taking any action
function change_turn(){
   if(active_color == COLOR_PLAYER){ 
       active_color = COLOR_OPPONENT;
	   $("messages").style.backgroundColor = COLOR_OPPONENT;
	  $("messages").innerHTML = "Opponent's Move";
	   $("messages").style.color = COLOR_PLAYER;


   }
   else{
	   active_color = COLOR_PLAYER;
	   $("messages").style.backgroundColor = COLOR_PLAYER;
	   $("messages").innerHTML = "Player's Move";
	   $("messages").style.color = COLOR_OPPONENT;

   }
}

function display_score(){
	$("player_score").innerHTML = player_score;
	$("opponent_score").innerHTML = opponent_score;
}   
    
//letter_array = [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z]; 

function place_piece(element)
{                              

 //if the cell does not have a placement we can then test if its a valid flank
 if(valid_flank(element)){   	
	
	 var current_color = trim_string(element.style.backgroundColor);
	
	if(game_type == TWO_PLAYER_LOCAL){   
	   
	   element.style.backgroundColor = active_color; 
    }

   point_for_current();
   flanking_actions(element);

    change_turn(); 
   
    display_score();

    //if the scores sum = 64 we have placed all of the pieces
    if((player_score + opponent_score) == 64)
    {
	   if(player_score == opponent){
	     message = "There is a tie."	
	   } 
	   else if(player_score < opponent_score){
	     message = "Opponent Wins."	
	   }
	   else{
	     message = "Player wins";	
	   }
	  alert(message);
    }
  }
  else{
     $("messages").innerHTML = "Not a Valid Move!";
     $("messages").style.color = "red";
	 
  }                       
	
	
}       

function flanking_actions(element){   
    
     //now flip the valid locations
    for(index in flankable_directions){
	     if(flankable_directions[index]){	
           flip_direction(element,DIRECTIONS[index]);		  
 	     }
     }
  
}

function get_coords(element){
	//the id is row_column
   var id = element.getAttribute('id');

   column = id[2];
   row = id[0];

 return [row,column]
}


function reset_flankable_directions(){
  flankable_directions = [false,false,false,false,false,false,false,false]; //the directions that are flankable for the current piece
}


//flips all in a direction until cell of same color is reached
//this assumes the direction is a valid flank direction
//sets the score after each flip is mades
function flip_direction(element,direction){
	var position = get_coords(element);
    var row = position[0];
    var column = position[1];
    
    var next_element =  move(element,direction);
    var current_color = trim_string(next_element.style.backgroundColor);
        
    var i = 0; //this loop can easily become infinite if not handled with care so this is a failsafe while developing
    while(current_color != active_color  && i < SIZE)
    {
	    set_scores();
	   next_element.style.backgroundColor = active_color;
	   next_element = move(next_element,direction);
	   current_color = trim_string(next_element.style.backgroundColor);	 
	   i++; 
	
    }
	
}

//every time a flip is made we can increment the score for the active color
//and decrement the score for the inactive color
function set_scores(){
	if(active_color == COLOR_PLAYER){
		player_score++;
		opponent_score--;
	}
	else{
		player_score--;
		opponent_score++;
	}
}

//we need to add a point for the piece placed on the board also
function point_for_current(){
	if(active_color == COLOR_PLAYER){
		player_score++;
	}
	else{
		opponent_score++;
	}
}

//we need to test if its a valid flank 
//first we test if there are any opposite color pieces around the give cell
//then we test in those valid directions
function valid_flank(element,perform_flip){
    var	current_color = trim_string(element.style.backgroundColor);
    var valid_flank_found = false;
        reset_flankable_directions();
    // figure out what the valid flank color is this is the color that we can place
    // a piece next to
    var target_color = (active_color == COLOR_PLAYER) ? COLOR_OPPONENT : COLOR_PLAYER;
    
    //make sure there isn't already a piece played there
    if(current_color != COLOR_EMPTY){
	   return false;
    }	
	else{	
	   
	   //find the first item that is a valid flank makes a note of all of the valid
	   //flanking directions
	   //this is a pre test to see if we can place a piece where we have chosen
	   for(index in DIRECTIONS){
		    var direction = DIRECTIONS[index];
			var next_element = move(element,direction);
			var next_color = trim_string(next_element.style.backgroundColor); 
	           
			//if the direction holds a valid element move in that direction
			//until the move function returns the element you pass it
			//this means it no longer can move in that direction. Or until it
			//reaches an item that is empty or.. the active color
			if(next_color == target_color){
			   var e1 = next_element;
			   var e2 = move(e1,direction);
	               next_color = trim_string(e2.style.backgroundColor);

			   while(e1 != e2){
			     
			       if(next_color == active_color){
				    valid_flank_found = true;
				    flankable_directions[index] = true;
				    break;
				   }
				   else if(next_color == COLOR_EMPTY){
				    break
	               }
				   else if(next_color == target_color){
			        e1 = e2;
				    e2 = move(e2, direction);
				    next_color = trim_string(e2.style.backgroundColor);
			       }

			    
			   }	
			}
			
		}
   }
 return valid_flank_found;  //if we haven't already exitend than we must not have found a valid direction;
}

function get_color_for_cell(column,row){
return	$(row + "_" + column).style.backgroundColor;
}

function $(element_id){
return	document.getElementById(element_id);
}

function get_tags_by_class(klass,tag){
	var retVal = new Array();
    var elements = document.getElementsByTagName(tag);
    for(var i = 0;i < elements.length;i++){
        if(elements[i].className.indexOf(" ") >= 0){
            var classes = elements[i].className.split(" ");
            for(var j = 0;j < classes.length;j++){
                if(classes[j] == klass)
                    retVal.push(elements[i]);
            }
        }
        else if(elements[i].className == klass)
            retVal.push(elements[i]);
    }
    return retVal;
}

//the the element that is one step in the given direction
//returns the original element if a move in that direction is not valid
function move(element,direction){
	
	var position = get_coords(element);
	var column = position[1];
	var row = position[0];
	
	switch(direction){
		case NORTH: row--;
		    break;
		case NORTHEAST: column++; row--;
		    break;
		case EAST: column++;
		    break;
		case SOUTHEAST: column++; row++;
		    break;
		case SOUTH: row++;
		    break;
		case SOUTHWEST: column--; row++;
		    break;
		case WEST: column--;
		    break;
		case NORTHWEST: column--; row--;
		    break;
		default: //do nothing
	}
    var valid_move = (check_bounds(column) && check_bounds(row));
 return valid_move ? $(row + "_" + column) : element;	
}

//make sure the given value is not greater or less than the size boundaries;
function check_bounds(value){
   	return (value > 0 && value <= SIZE);
}

//this should work without the while loop but when I tried it with /\s+/ it was only removing the firtst whitespace
function trim_string(str) {
 var ret = str;
 while(ret.search(/[\s\0\t]/) != -1)
 {
  ret = ret.replace(/[\s\0\t]/,'');
 }

return ret;
}


