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
  
  let results = {
    "success": true,
    "message": "This is the Public API, Anyone can request this"
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(results));
  
}

/**
 * This is private, you will need a valid JWT AND requires a specific claim in the JWT to access this endpoint
 */
function handleAccessEndpoint(req, res) {
  console.log("handleAccessEndpoint()");
  
}