const getPIC = (req, res) => {
    try {
        
    } catch (err) {
        return res.status(500).json({
            status_code : 500,
            message : 'Internal Server Error',
            errors : err.message
        })
    }
    
}

const storePIC = (req,res) => {
    res.send("This is store PIC")
}

const  updatePIC = (req,res) => {
    res.send("This is update PIC")
}

const  deletePIC = (req,res) => {
    res.send("This is delete PIC")
}

export {getPIC, storePIC, updatePIC, deletePIC};