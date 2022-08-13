function run(argv) {
    var taskQuery = argv[0];
    console.log('Received output: ', taskQuery);

    const of = Application('OmniFocus');
    const ofDoc = of.defaultDocument;

    of.parseTasksInto(ofDoc, {
        withTransportText: taskQuery,
        asSingleTask: true
    });

    return taskQuery;
}
