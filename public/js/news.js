const { default: Axios } = require("axios");

const axios = require("axios");

const getAxiosRes = ()=> {
    axios.get('/api/v1/posts/?auth_token=1963eff4d6b7f1a3d0f897534b0e2a3d64f940d2')
    .then(result => {
        console.log(result)
    })
    .catch(err => {
        console.log(err)
});
}

getAxiosRes();