const getPIC = (req,res) => {
    res.send("This is get PIC")
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