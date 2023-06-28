const createTask = async (req, res) => {
    try {
        let { title, description } = req.body;
        let userId = req.decode.userId
        if (title) title = title.trim();
        if (!title) return res.status(400).send({ status: false, message: "please provide a title" });

        if (description) description = description.trim();
        if (!description) return res.status(400).send({ status: false, message: "please provide description" });

        const createQuery = `INSERT INTO task(title, description, user_id) VALUE ('${title}','${description}','${userId}')`;
        const taskData = await new Promise((resolve, reject) => {
            req.db.query(createQuery, (err, data) => {
                if (err) reject(err)
                if (data) resolve(data)
            })
        })
            .catch((err) => res.status(500).send({ status: false, message: err.message }));
        return res.status(201).send({ status: true, message: "task created" });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const userId = req.decode.userId;
        const getQuery = `SELECT task_id,title,description FROM task WHERE is_deleted = 'false' AND user_id = ${userId} ORDER BY created_at DESC`;
        const data = await new Promise((resolve, reject) => {
            req.db.query(getQuery, (err, data) => {
                if (err) reject(err);
                if (data) resolve(data);
            })
        }).catch((err) => res.status(500).send({ status: false, message: err.message }));
        return res.status(200).send({status:true,data:data});
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const updateTask = async (req,res)=>{
    try{
        let {title,description,task_id} = req.body;

        let updateQuery = `UPDATE task SET title = CASE WHEN '${title}' != 'undefined' THEN '${title}' ELSE title END,description = CASE WHEN '${description}' != 'undefined' THEN '${description}' ELSE description END WHERE task_id = '${task_id}'`;

        let data = await new Promise((resolve, reject)=>{
            req.db.query(updateQuery,(err,data)=>{
                if(err) reject(err)
                if(data) resolve(data)
            })
        }).catch((err) => res.status(500).send({ status: false, message: err.message }));

        if(data.affectedRows > 0) return res.status(200).send({status:true,message:"task updated successfully"}) ;

    } catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}

const deleteTask = async (req,res)=>{
    try{
        
        const {task_id} = req.body;
        const deleteQuery = `UPDATE task SET is_deleted = 'true' WHERE task_id = '${task_id}'`;

        const data = await new Promise((resolve,reject)=>{
            req.db.query(deleteQuery,(err,data)=>{
                if(err) reject(err)
                if(data) resolve(data)
            })
        }).catch((err) => res.status(500).send({ status: false, message: err.message }));
    
        if(data.affectedRows>0) return res.status(200).send({status:true,message:"task deleted successfully"});

    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}

module.exports = { createTask, getAllTasks, updateTask, deleteTask }