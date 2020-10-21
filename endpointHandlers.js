/**
 * This is public, anyone can call it
 */
function handlePublicEndpoint(req, res) {
  console.log("handlePublicEndpoint()");
  
  res.send('This is the Fun Auth API');
}

/**
 * This is private, you need a valid JWT to call it
 */
function handlePrivateEndpoint(req, res) {
  console.log("handlePrivateEndpoint()");
  
}

/**
 * This is 
 */
function handleAccessEndpoint(req, res) {
  console.log("handleAccessEndpoint()");
  
}