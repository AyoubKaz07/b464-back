function weightDist(questions) {
    if (questions.length === 2) {
        return [0, 100]
    }
    if (questions.length === 3) {
        return [0, 50, 100]
    }
    if (questions.length === 4) {
        return [0, 33, 66, 100]
    }
    if (questions.length === 5) {
        return [0, 25, 50, 75, 100]
    }
}

export default weightDist;