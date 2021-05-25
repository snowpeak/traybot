const CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
  '!', '#', '$', '%', '&', '(', ')', '-', '=', '+',
  '/', '*', '[', ']' ];

function makePasswd(x_length){
  let p_pass = "";
  for(let i=0; i<x_length; i++){
    let p_rand = Math.floor(Math.random() * CHARS.length)
    p_pass += CHARS[p_rand];
  }
  return p_pass;
}
  