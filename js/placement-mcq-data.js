/**
 * 120 MCQs for Placement (20 Questions × 6 Skills)
 * Skills: Python, Java, DSA, AI & ML, SQL/MySQL, Cloud Computing
 * Format: 4 options + Correct Answer
 */

export const PLACEMENT_MCQ_DATA = {
  python: {
    name: 'Python',
    icon: '🐍',
    color: '#38bdf8',
    description: 'Core Python, Syntax, OOP, Data Types, Iterators & Standard Libraries',
    questions: [
      {
        id: 'py_1',
        question: 'Which keyword is used to define a function in Python?',
        options: { A: 'function', B: 'def', C: 'fun', D: 'define' },
        answer: 'B'
      },
      {
        id: 'py_2',
        question: 'What is the output of len("Python")?',
        options: { A: '5', B: '6', C: '7', D: 'Error' },
        answer: 'B'
      },
      {
        id: 'py_3',
        question: 'Which data type is mutable in Python?',
        options: { A: 'Tuple', B: 'String', C: 'List', D: 'Integer' },
        answer: 'C'
      },
      {
        id: 'py_4',
        question: 'Which function takes user input in Python 3?',
        options: { A: 'read()', B: 'scan()', C: 'input()', D: 'get()' },
        answer: 'C'
      },
      {
        id: 'py_5',
        question: 'Which symbol means "not equal" in Python?',
        options: { A: '==', B: '=', C: '!=', D: '<>' },
        answer: 'C'
      },
      {
        id: 'py_6',
        question: 'Index of the first element in a Python list is:',
        options: { A: '1', B: '0', C: '-1', D: '2' },
        answer: 'B'
      },
      {
        id: 'py_7',
        question: 'Which loop is used for iteration over a sequence?',
        options: { A: 'while', B: 'repeat', C: 'for', D: 'do' },
        answer: 'C'
      },
      {
        id: 'py_8',
        question: 'Which collection stores unique values only?',
        options: { A: 'List', B: 'Dictionary', C: 'Set', D: 'Tuple' },
        answer: 'C'
      },
      {
        id: 'py_9',
        question: '5 // 2 returns:',
        options: { A: '2.5', B: '3', C: '2', D: '1' },
        answer: 'C'
      },
      {
        id: 'py_10',
        question: 'Which keyword immediately exits a loop?',
        options: { A: 'stop', B: 'break', C: 'exit', D: 'continue' },
        answer: 'B'
      },
      {
        id: 'py_11',
        question: 'Which keyword skips the current iteration of a loop?',
        options: { A: 'pass', B: 'break', C: 'continue', D: 'return' },
        answer: 'C'
      },
      {
        id: 'py_12',
        question: 'A Python dictionary stores data as:',
        options: { A: 'Values only', B: 'Keys only', C: 'Key–Value pairs', D: 'Indexes' },
        answer: 'C'
      },
      {
        id: 'py_13',
        question: 'Which operator checks equality in Python?',
        options: { A: '=', B: '==', C: '!=', D: '===' },
        answer: 'B'
      },
      {
        id: 'py_14',
        question: 'Which keyword returns a value from a function?',
        options: { A: 'print', B: 'return', C: 'output', D: 'yield' },
        answer: 'B'
      },
      {
        id: 'py_15',
        question: 'Which function converts a string to an integer?',
        options: { A: 'str()', B: 'float()', C: 'int()', D: 'bool()' },
        answer: 'C'
      },
      {
        id: 'py_16',
        question: 'Which is a valid Boolean literal in Python?',
        options: { A: '1', B: '"True"', C: 'True', D: 'yes' },
        answer: 'C'
      },
      {
        id: 'py_17',
        question: 'What is the output of 3**2 in Python?',
        options: { A: '6', B: '9', C: '8', D: '32' },
        answer: 'B'
      },
      {
        id: 'py_18',
        question: 'Python is fundamentally an:',
        options: { A: 'Compiled only language', B: 'Interpreted language', C: 'Assembly language', D: 'Machine language' },
        answer: 'B'
      },
      {
        id: 'py_19',
        question: 'Which symbol is used for single-line comments in Python?',
        options: { A: '//', B: '#', C: '/* */', D: '--' },
        answer: 'B'
      },
      {
        id: 'py_20',
        question: 'Which built-in module is used for standard mathematical functions?',
        options: { A: 'random', B: 'math', C: 'os', D: 'sys' },
        answer: 'B'
      }
    ]
  },

  java: {
    name: 'Java',
    icon: '☕',
    color: '#fbbf24',
    description: 'Core Java, JVM Architecture, OOP Concepts, Collections & Concurrency',
    questions: [
      {
        id: 'jv_1',
        question: 'Java is primarily a:',
        options: { A: 'Markup language', B: 'Object-Oriented language', C: 'Database', D: 'Script' },
        answer: 'B'
      },
      {
        id: 'jv_2',
        question: 'What is the standard entry point of a Java program?',
        options: { A: 'run()', B: 'start()', C: 'main()', D: 'init()' },
        answer: 'C'
      },
      {
        id: 'jv_3',
        question: 'Which keyword creates a new object in Java?',
        options: { A: 'object', B: 'new', C: 'create', D: 'make' },
        answer: 'B'
      },
      {
        id: 'jv_4',
        question: 'JVM stands for:',
        options: { A: 'Java Variable Machine', B: 'Java Virtual Machine', C: 'Java Version Machine', D: 'Java Visual Machine' },
        answer: 'B'
      },
      {
        id: 'jv_5',
        question: 'Which of the following is NOT a primitive type in Java?',
        options: { A: 'int', B: 'char', C: 'String', D: 'boolean' },
        answer: 'C'
      },
      {
        id: 'jv_6',
        question: 'Which keyword is used for inheritance in Java?',
        options: { A: 'implement', B: 'extends', C: 'inherit', D: 'super' },
        answer: 'B'
      },
      {
        id: 'jv_7',
        question: 'Which package is automatically imported in every Java program?',
        options: { A: 'java.io', B: 'java.util', C: 'java.lang', D: 'java.sql' },
        answer: 'C'
      },
      {
        id: 'jv_8',
        question: 'Which loop is guaranteed to execute at least once?',
        options: { A: 'while', B: 'for', C: 'do-while', D: 'foreach' },
        answer: 'C'
      },
      {
        id: 'jv_9',
        question: 'In Java, array index starts from:',
        options: { A: '1', B: '0', C: '-1', D: '2' },
        answer: 'B'
      },
      {
        id: 'jv_10',
        question: 'The constructor name in a Java class must be:',
        options: { A: 'Different from class', B: 'Same as class', C: 'main', D: 'Object' },
        answer: 'B'
      },
      {
        id: 'jv_11',
        question: 'Which access modifier is the most restrictive/secure?',
        options: { A: 'public', B: 'protected', C: 'private', D: 'default' },
        answer: 'C'
      },
      {
        id: 'jv_12',
        question: 'Which keyword refers to the current object instance?',
        options: { A: 'self', B: 'this', C: 'super', D: 'current' },
        answer: 'B'
      },
      {
        id: 'jv_13',
        question: 'What is the standard Java source file extension?',
        options: { A: '.js', B: '.class', C: '.java', D: '.jar' },
        answer: 'C'
      },
      {
        id: 'jv_14',
        question: 'What is the compiled Java bytecode file extension?',
        options: { A: '.exe', B: '.class', C: '.java', D: '.obj' },
        answer: 'B'
      },
      {
        id: 'jv_15',
        question: 'Which collection interface implementation stores unique elements?',
        options: { A: 'ArrayList', B: 'LinkedList', C: 'HashSet', D: 'Vector' },
        answer: 'C'
      },
      {
        id: 'jv_16',
        question: 'Which class is the superclass of all Exceptions in Java?',
        options: { A: 'Object', B: 'Error', C: 'Throwable', D: 'Runtime' },
        answer: 'C'
      },
      {
        id: 'jv_17',
        question: 'Which keyword handles exceptions in a try block?',
        options: { A: 'catch', B: 'except', C: 'throw', D: 'error' },
        answer: 'A'
      },
      {
        id: 'jv_18',
        question: 'Method overloading means:',
        options: { A: 'Same method name, different parameters', B: 'Different class', C: 'Different object', D: 'Same variable' },
        answer: 'A'
      },
      {
        id: 'jv_19',
        question: 'Which keyword prevents a class from being inherited?',
        options: { A: 'static', B: 'final', C: 'const', D: 'abstract' },
        answer: 'B'
      },
      {
        id: 'jv_20',
        question: 'Java supports multiple inheritance through:',
        options: { A: 'Classes', B: 'Interfaces', C: 'Objects', D: 'Packages' },
        answer: 'B'
      }
    ]
  },

  dsa: {
    name: 'DSA',
    icon: '🌲',
    color: '#10b981',
    description: 'Data Structures & Algorithms, Trees, Graphs, Sorting & Complexities',
    questions: [
      {
        id: 'dsa_1',
        question: 'A Stack data structure follows which order?',
        options: { A: 'FIFO', B: 'LIFO', C: 'FILO', D: 'Random' },
        answer: 'B'
      },
      {
        id: 'dsa_2',
        question: 'A Queue data structure follows which order?',
        options: { A: 'LIFO', B: 'FIFO', C: 'Random', D: 'LILO' },
        answer: 'B'
      },
      {
        id: 'dsa_3',
        question: 'Binary Search algorithm operates effectively on:',
        options: { A: 'Unsorted array', B: 'Sorted array', C: 'Graph', D: 'Queue' },
        answer: 'B'
      },
      {
        id: 'dsa_4',
        question: 'What is the time complexity of Binary Search?',
        options: { A: 'O(n)', B: 'O(log n)', C: 'O(n²)', D: 'O(1)' },
        answer: 'B'
      },
      {
        id: 'dsa_5',
        question: 'What is the best case time complexity of Linear Search?',
        options: { A: 'O(n)', B: 'O(1)', C: 'O(log n)', D: 'O(n²)' },
        answer: 'B'
      },
      {
        id: 'dsa_6',
        question: 'Which data structure naturally backs recursion?',
        options: { A: 'Queue', B: 'Stack', C: 'Heap', D: 'Array' },
        answer: 'B'
      },
      {
        id: 'dsa_7',
        question: 'The top-most node with no parent in hierarchical structures is the Root of a:',
        options: { A: 'Graph', B: 'Tree', C: 'Stack', D: 'Queue' },
        answer: 'B'
      },
      {
        id: 'dsa_8',
        question: 'Left–Root–Right traversal in a Binary Tree is known as:',
        options: { A: 'Preorder', B: 'Inorder', C: 'Postorder', D: 'Level' },
        answer: 'B'
      },
      {
        id: 'dsa_9',
        question: 'A Graph data structure fundamentally consists of:',
        options: { A: 'Keys', B: 'Nodes & Edges', C: 'Rows', D: 'Values' },
        answer: 'B'
      },
      {
        id: 'dsa_10',
        question: 'What is the worst case time complexity of Bubble Sort?',
        options: { A: 'O(log n)', B: 'O(n)', C: 'O(n²)', D: 'O(1)' },
        answer: 'C'
      },
      {
        id: 'dsa_11',
        question: 'An Array stores its elements in:',
        options: { A: 'Random memory', B: 'Contiguous memory', C: 'Cloud', D: 'Disk' },
        answer: 'B'
      },
      {
        id: 'dsa_12',
        question: 'What is the time complexity of inserting at the beginning of a Singly Linked List?',
        options: { A: 'O(n)', B: 'O(log n)', C: 'O(1)', D: 'O(n²)' },
        answer: 'C'
      },
      {
        id: 'dsa_13',
        question: 'A Heap data structure is primarily used to implement a:',
        options: { A: 'Queue', B: 'Priority Queue', C: 'Stack', D: 'Hashing' },
        answer: 'B'
      },
      {
        id: 'dsa_14',
        question: 'Breadth-First Search (BFS) on graphs uses which data structure?',
        options: { A: 'Stack', B: 'Queue', C: 'Heap', D: 'Array' },
        answer: 'B'
      },
      {
        id: 'dsa_15',
        question: 'Depth-First Search (DFS) on graphs primarily uses a:',
        options: { A: 'Queue', B: 'Stack', C: 'Tree', D: 'HashMap' },
        answer: 'B'
      },
      {
        id: 'dsa_16',
        question: 'What is the average case search time in a well-distributed HashMap?',
        options: { A: 'O(n)', B: 'O(log n)', C: 'O(1)', D: 'O(n²)' },
        answer: 'C'
      },
      {
        id: 'dsa_17',
        question: 'Which of the following is a non-linear data structure?',
        options: { A: 'Queue', B: 'Stack', C: 'Tree', D: 'Array' },
        answer: 'C'
      },
      {
        id: 'dsa_18',
        question: 'DSA stands for:',
        options: { A: 'Data System Algorithm', B: 'Data Structures & Algorithms', C: 'Digital Search Analysis', D: 'Data Storage Architecture' },
        answer: 'B'
      },
      {
        id: 'dsa_19',
        question: 'Which of the following sorting algorithms is stable by definition?',
        options: { A: 'Quick Sort', B: 'Bubble Sort', C: 'Heap Sort', D: 'Selection Sort' },
        answer: 'B'
      },
      {
        id: 'dsa_20',
        question: 'Push and Pop operations belong to which data structure?',
        options: { A: 'Queue', B: 'Stack', C: 'Tree', D: 'Graph' },
        answer: 'B'
      }
    ]
  },

  ai_ml: {
    name: 'AI & ML',
    icon: '🤖',
    color: '#ec4899',
    description: 'Machine Learning, Deep Neural Networks, NLP, Computer Vision & MLOps',
    questions: [
      {
        id: 'ai_1',
        question: 'AI stands for:',
        options: { A: 'Artificial Intelligence', B: 'Automatic Internet', C: 'Artificial Interface', D: 'Auto Information' },
        answer: 'A'
      },
      {
        id: 'ai_2',
        question: 'ML stands for:',
        options: { A: 'Machine Learning', B: 'Machine Language', C: 'Memory Logic', D: 'Modern Learning' },
        answer: 'A'
      },
      {
        id: 'ai_3',
        question: 'Supervised learning algorithms require:',
        options: { A: 'Labeled data', B: 'Images only', C: 'Audio only', D: 'Unlabeled data' },
        answer: 'A'
      },
      {
        id: 'ai_4',
        question: 'Unsupervised learning discovers patterns in:',
        options: { A: 'Labeled data', B: 'Unlabeled data', C: 'Video', D: 'Text only' },
        answer: 'B'
      },
      {
        id: 'ai_5',
        question: 'Email spam detection is an example of:',
        options: { A: 'Regression', B: 'Classification', C: 'Clustering', D: 'Reinforcement' },
        answer: 'B'
      },
      {
        id: 'ai_6',
        question: 'Predicting continuous house prices based on features is:',
        options: { A: 'Regression', B: 'Classification', C: 'Clustering', D: 'NLP' },
        answer: 'A'
      },
      {
        id: 'ai_7',
        question: 'Artificial Neural Networks are conceptually inspired by:',
        options: { A: 'CPU', B: 'Human brain', C: 'Cloud', D: 'Database' },
        answer: 'B'
      },
      {
        id: 'ai_8',
        question: 'In machine learning, a dataset refers to a:',
        options: { A: 'Program', B: 'Collection of data', C: 'IDE', D: 'Browser' },
        answer: 'B'
      },
      {
        id: 'ai_9',
        question: 'Classification accuracy fundamentally measures:',
        options: { A: 'Memory', B: 'Correct predictions ratio', C: 'Speed', D: 'Storage' },
        answer: 'B'
      },
      {
        id: 'ai_10',
        question: 'Which programming language is most widely used in modern AI research?',
        options: { A: 'Java', B: 'Python', C: 'C', D: 'PHP' },
        answer: 'B'
      },
      {
        id: 'ai_11',
        question: 'Google TensorFlow is an open-source:',
        options: { A: 'Database', B: 'ML Framework', C: 'IDE', D: 'OS' },
        answer: 'B'
      },
      {
        id: 'ai_12',
        question: 'The Pandas library in Python is primarily used for:',
        options: { A: 'Gaming', B: 'Data Analysis & Manipulation', C: 'Networking', D: 'HTML' },
        answer: 'B'
      },
      {
        id: 'ai_13',
        question: 'NumPy is primarily used for:',
        options: { A: 'CSS', B: 'Numerical Computing & N-D Arrays', C: 'SQL', D: 'Browser' },
        answer: 'B'
      },
      {
        id: 'ai_14',
        question: 'Overfitting occurs when a model:',
        options: { A: 'Memorizes training data and fails to generalize', B: 'Learns too slowly', C: 'Lacks data', D: 'Throws a cloud error' },
        answer: 'A'
      },
      {
        id: 'ai_15',
        question: 'K-Means clustering belongs to which machine learning paradigm?',
        options: { A: 'Supervised', B: 'Unsupervised', C: 'Regression', D: 'Reinforcement' },
        answer: 'B'
      },
      {
        id: 'ai_16',
        question: 'Reinforcement learning trains an agent through:',
        options: { A: 'Labels', B: 'Rewards & Penalties', C: 'Tables', D: 'Queries' },
        answer: 'B'
      },
      {
        id: 'ai_17',
        question: 'NLP stands for:',
        options: { A: 'Natural Language Processing', B: 'New Logic Process', C: 'Network Language Program', D: 'Natural Learning Process' },
        answer: 'A'
      },
      {
        id: 'ai_18',
        question: 'OpenAI ChatGPT is an example of Generative:',
        options: { A: 'AI', B: 'SQL', C: 'HTML', D: 'CSS' },
        answer: 'A'
      },
      {
        id: 'ai_19',
        question: 'Computer Vision algorithms specialize in processing:',
        options: { A: 'Images and Video streams', B: 'Audio only', C: 'SQL', D: 'Text only' },
        answer: 'A'
      },
      {
        id: 'ai_20',
        question: 'Model training essentially means enabling the algorithm to:',
        options: { A: 'Delete data', B: 'Learn patterns & adjust parameters', C: 'Compile code', D: 'Format disk' },
        answer: 'B'
      }
    ]
  },

  sql: {
    name: 'SQL / MySQL',
    icon: '🗄️',
    color: '#00f5ff',
    description: 'Relational Databases, CRUD Operations, JOINs, Indexing & Aggregations',
    questions: [
      {
        id: 'sql_1',
        question: 'SQL stands for:',
        options: { A: 'Structured Query Language', B: 'System Query Logic', C: 'Simple Query Language', D: 'Server Question Language' },
        answer: 'A'
      },
      {
        id: 'sql_2',
        question: 'Which command is used to retrieve data from a database?',
        options: { A: 'GET', B: 'SELECT', C: 'SHOW', D: 'FETCH' },
        answer: 'B'
      },
      {
        id: 'sql_3',
        question: 'Which statement is used to insert new records into a table?',
        options: { A: 'UPDATE', B: 'INSERT INTO', C: 'ADD', D: 'CREATE' },
        answer: 'B'
      },
      {
        id: 'sql_4',
        question: 'Which SQL command deletes rows from a table?',
        options: { A: 'REMOVE', B: 'DELETE', C: 'DROP', D: 'CLEAR' },
        answer: 'B'
      },
      {
        id: 'sql_5',
        question: 'Which clause is used to modify existing data in a table?',
        options: { A: 'CHANGE', B: 'ALTER', C: 'UPDATE', D: 'EDIT' },
        answer: 'C'
      },
      {
        id: 'sql_6',
        question: 'Which command creates a new table in a database?',
        options: { A: 'NEW', B: 'CREATE TABLE', C: 'MAKE', D: 'ADD' },
        answer: 'B'
      },
      {
        id: 'sql_7',
        question: 'A Primary Key in a relational table must be:',
        options: { A: 'A duplicate value', B: 'A unique identifier (non-null)', C: 'Text only', D: 'Optional' },
        answer: 'B'
      },
      {
        id: 'sql_8',
        question: 'A Foreign Key establishes a:',
        options: { A: 'Syntax error', B: 'Relationship between two tables', C: 'Copy', D: 'Loop' },
        answer: 'B'
      },
      {
        id: 'sql_9',
        question: 'Which clause filters rows matching a specified condition?',
        options: { A: 'GROUP BY', B: 'WHERE', C: 'ORDER BY', D: 'LIMIT' },
        answer: 'B'
      },
      {
        id: 'sql_10',
        question: 'Which keyword sorts the result set in ascending order?',
        options: { A: 'DESC', B: 'ASC', C: 'UP', D: 'SORT' },
        answer: 'B'
      },
      {
        id: 'sql_11',
        question: 'Which aggregate function counts the number of rows?',
        options: { A: 'SUM()', B: 'COUNT()', C: 'AVG()', D: 'MAX()' },
        answer: 'B'
      },
      {
        id: 'sql_12',
        question: 'Which function returns the maximum value in a column?',
        options: { A: 'HIGH()', B: 'MAX()', C: 'TOP()', D: 'BIG()' },
        answer: 'B'
      },
      {
        id: 'sql_13',
        question: 'A SQL JOIN clause combines rows from two or more:',
        options: { A: 'Columns', B: 'Tables', C: 'Databases', D: 'Keys' },
        answer: 'B'
      },
      {
        id: 'sql_14',
        question: 'The GROUP BY statement is frequently used with:',
        options: { A: 'Aggregate functions (COUNT, MAX, SUM)', B: 'Delete', C: 'Insert', D: 'Drop' },
        answer: 'A'
      },
      {
        id: 'sql_15',
        question: 'MySQL is an open-source:',
        options: { A: 'Web Browser', B: 'Relational Database Management System (RDBMS)', C: 'IDE', D: 'Programming language' },
        answer: 'B'
      },
      {
        id: 'sql_16',
        question: 'Which command removes an entire table and its schema permanently?',
        options: { A: 'DELETE', B: 'DROP TABLE', C: 'CLEAR', D: 'ERASE' },
        answer: 'B'
      },
      {
        id: 'sql_17',
        question: 'In SQL LIKE pattern matching, the % wildcard represents:',
        options: { A: 'Exactly one character', B: 'Zero, one, or multiple characters', C: 'Digit only', D: 'Space' },
        answer: 'B'
      },
      {
        id: 'sql_18',
        question: 'In SQL LIKE pattern matching, the _ (underscore) represents:',
        options: { A: 'Any number of characters', B: 'Exactly one single character', C: 'Number only', D: 'None' },
        answer: 'B'
      },
      {
        id: 'sql_19',
        question: 'Which DDL command modifies an existing table structure (e.g. add column)?',
        options: { A: 'UPDATE', B: 'ALTER TABLE', C: 'MODIFY', D: 'CHANGE' },
        answer: 'B'
      },
      {
        id: 'sql_20',
        question: 'What is the default TCP/IP port used by MySQL server?',
        options: { A: '8080', B: '3306', C: '5432', D: '1521' },
        answer: 'B'
      }
    ]
  },

  cloud: {
    name: 'Cloud Computing',
    icon: '☁️',
    color: '#818cf8',
    description: 'AWS, Cloud Architecture, IaaS/PaaS/SaaS, Docker & Kubernetes',
    questions: [
      {
        id: 'cc_1',
        question: 'Cloud Computing is broadly defined as:',
        options: { A: 'Local offline storage', B: 'On-demand internet-based computing resources', C: 'CPU design', D: 'RAM chips' },
        answer: 'B'
      },
      {
        id: 'cc_2',
        question: 'Which of the following is a leading public cloud provider?',
        options: { A: 'AWS', B: 'Chrome', C: 'MySQL', D: 'Eclipse' },
        answer: 'A'
      },
      {
        id: 'cc_3',
        question: 'AWS stands for:',
        options: { A: 'Amazon Web Services', B: 'Advanced Web System', C: 'Automated Web Service', D: 'Amazon Wide Server' },
        answer: 'A'
      },
      {
        id: 'cc_4',
        question: 'Which of the following is NOT a standard cloud service model?',
        options: { A: 'IaaS', B: 'PaaS', C: 'SaaS', D: 'HTML' },
        answer: 'D'
      },
      {
        id: 'cc_5',
        question: 'Which of the following is a classic example of SaaS (Software as a Service)?',
        options: { A: 'Google Gmail', B: 'EC2', C: 'Docker', D: 'Linux' },
        answer: 'A'
      },
      {
        id: 'cc_6',
        question: 'Which service exemplifies PaaS (Platform as a Service)?',
        options: { A: 'Google App Engine', B: 'Hard Disk', C: 'Windows OS', D: 'Router' },
        answer: 'A'
      },
      {
        id: 'cc_7',
        question: 'IaaS (Infrastructure as a Service) provides virtualized:',
        options: { A: 'Compute, networking, and storage infrastructure', B: 'Email apps only', C: 'Browser extensions', D: 'IDE themes' },
        answer: 'A'
      },
      {
        id: 'cc_8',
        question: 'A Virtual Machine (VM) is an emulation of a:',
        options: { A: 'Physical computer system in software', B: 'Hardwired monitor', C: 'Router', D: 'Database only' },
        answer: 'A'
      },
      {
        id: 'cc_9',
        question: 'Which AWS service is an object storage service designed for storing files/blobs?',
        options: { A: 'Amazon S3', B: 'EC2', C: 'Lambda', D: 'RDS' },
        answer: 'A'
      },
      {
        id: 'cc_10',
        question: 'Amazon EC2 provides scalable:',
        options: { A: 'Relational Database', B: 'Virtual Compute Servers', C: 'Email Server only', D: 'DNS registry only' },
        answer: 'B'
      },
      {
        id: 'cc_11',
        question: 'Amazon RDS stands for:',
        options: { A: 'Relational Database Service', B: 'Remote Data Server', C: 'Resource Data Storage', D: 'Random Database System' },
        answer: 'A'
      },
      {
        id: 'cc_12',
        question: 'Cloud scalability refers to the ability to:',
        options: { A: 'Dynamically increase or decrease computing resources', B: 'Delete server', C: 'Format storage', D: 'Disconnect internet' },
        answer: 'A'
      },
      {
        id: 'cc_13',
        question: 'A Public Cloud infrastructure is owned and maintained by a:',
        options: { A: 'Individual user', B: 'Third-party cloud service provider', C: 'School only', D: 'Private homeowner' },
        answer: 'B'
      },
      {
        id: 'cc_14',
        question: 'A Private Cloud is operated solely for:',
        options: { A: 'A single specific organization', B: 'The public free-of-cost', C: 'Students only', D: 'Mobile app gamers' },
        answer: 'A'
      },
      {
        id: 'cc_15',
        question: 'A Hybrid Cloud environment integrates:',
        options: { A: 'Public and Private cloud infrastructures', B: 'AWS + Linux', C: 'SQL + Java', D: 'AI + ML' },
        answer: 'A'
      },
      {
        id: 'cc_16',
        question: 'Which operational strategy improves cloud disaster recovery and high availability?',
        options: { A: 'Automated multi-region backups and replication', B: 'Deleting unused volumes', C: 'Formatting drives', D: 'Shutting down daily' },
        answer: 'A'
      },
      {
        id: 'cc_17',
        question: 'Docker is primarily used to package software into lightweight:',
        options: { A: 'Containers', B: 'Databases', C: 'Browsers', D: 'Compilers' },
        answer: 'A'
      },
      {
        id: 'cc_18',
        question: 'Kubernetes (K8s) is an open-source platform that automates the orchestration of:',
        options: { A: 'Containerized applications', B: 'Static HTML images', C: 'SQL queries', D: 'Firmware' },
        answer: 'A'
      },
      {
        id: 'cc_19',
        question: 'The cloud pricing model "Pay-as-you-go" means you:',
        options: { A: 'Pay a fixed monthly fee forever', B: 'Pay only for the resources and hours you consume', C: 'Get unlimited free cloud', D: 'Must sign a 10-year contract' },
        answer: 'B'
      },
      {
        id: 'cc_20',
        question: 'Which fundamental cloud networking characteristic provides worldwide low-latency access?',
        options: { A: 'Global Internet backbone and Content Delivery Networks (CDNs)', B: 'USB drives', C: 'DVDs', D: 'Local Bluetooth' },
        answer: 'A'
      }
    ]
  }
};
