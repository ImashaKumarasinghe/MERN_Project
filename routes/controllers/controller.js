import Student from "../../models/student.js";

export function getStudents(req, res) {
    Student.find()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to fetch students", error: error.message });
        });
}

export async function saveStudent(req, res) {
    try {
        console.log(req.body); // Log request body

        // Create a new student instance
        const student = new Student({
            name: req.body.name,
            age: req.body.age
        });

        // Save student to database
        await student.save(); // Added 'await' to properly wait for save operation

        res.json({ message: "Student added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Student addition failed", error: error.message });
    }
}
