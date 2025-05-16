
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CheatSheetItem {
  title: string;
  code: string;
  description: string;
}

interface CheatSheetCategory {
  name: string;
  items: CheatSheetItem[];
}

const cheatSheetData: Record<string, CheatSheetCategory[]> = {
  "react": [
    {
      name: "Hooks",
      items: [
        {
          title: "useState",
          code: "const [state, setState] = useState(initialState);",
          description: "Adds state to a functional component."
        },
        {
          title: "useEffect",
          code: "useEffect(() => {\n  // side effects\n  return () => {\n    // cleanup\n  };\n}, [dependencies]);",
          description: "Performs side effects in functional components."
        },
        {
          title: "useContext",
          code: "const value = useContext(MyContext);",
          description: "Accepts a context object and returns the current context value."
        },
        {
          title: "useReducer",
          code: "const [state, dispatch] = useReducer(reducer, initialState);",
          description: "Alternative to useState for complex state logic."
        },
        {
          title: "useCallback",
          code: "const memoizedCallback = useCallback(\n  () => {\n    doSomething(a, b);\n  },\n  [a, b],\n);",
          description: "Returns a memoized callback function."
        }
      ]
    },
    {
      name: "Components",
      items: [
        {
          title: "Functional Component",
          code: "function MyComponent(props) {\n  return <div>{props.name}</div>;\n}",
          description: "A simple React functional component."
        },
        {
          title: "Fragments",
          code: "<>\n  <Component1 />\n  <Component2 />\n</>",
          description: "Group multiple elements without adding extra nodes to the DOM."
        },
        {
          title: "Conditional Rendering",
          code: "{isLoggedIn ? <UserGreeting /> : <GuestGreeting />}",
          description: "Render different components based on a condition."
        }
      ]
    }
  ],
  "javascript": [
    {
      name: "ES6 Features",
      items: [
        {
          title: "Arrow Functions",
          code: "const add = (a, b) => a + b;",
          description: "Shorter syntax for function expressions."
        },
        {
          title: "Template Literals",
          code: "const greeting = `Hello, ${name}!`;",
          description: "String literals that allow embedded expressions."
        },
        {
          title: "Destructuring",
          code: "const { name, age } = person;",
          description: "Extract values from arrays or properties from objects."
        },
        {
          title: "Spread Operator",
          code: "const newArray = [...array1, ...array2];",
          description: "Expands arrays or objects where multiple elements are expected."
        }
      ]
    },
    {
      name: "Array Methods",
      items: [
        {
          title: "map()",
          code: "const doubled = numbers.map(num => num * 2);",
          description: "Creates a new array with the results of calling a function on every element."
        },
        {
          title: "filter()",
          code: "const evens = numbers.filter(num => num % 2 === 0);",
          description: "Creates a new array with elements that pass the test."
        },
        {
          title: "reduce()",
          code: "const sum = numbers.reduce((total, num) => total + num, 0);",
          description: "Reduces an array to a single value by executing a function on each element."
        }
      ]
    }
  ],
  "css": [
    {
      name: "Flexbox",
      items: [
        {
          title: "Flex Container",
          code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
          description: "Basic flexbox container setup."
        },
        {
          title: "Flex Direction",
          code: ".container {\n  display: flex;\n  flex-direction: column;\n}",
          description: "Sets the direction of flex items."
        },
        {
          title: "Flex Wrap",
          code: ".container {\n  display: flex;\n  flex-wrap: wrap;\n}",
          description: "Controls whether flex items wrap onto multiple lines."
        }
      ]
    },
    {
      name: "Grid",
      items: [
        {
          title: "Grid Container",
          code: ".container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 10px;\n}",
          description: "Basic CSS grid container setup."
        },
        {
          title: "Grid Areas",
          code: ".container {\n  display: grid;\n  grid-template-areas:\n    \"header header\"\n    \"sidebar content\";\n}",
          description: "Defines grid template areas."
        }
      ]
    }
  ],
  "typescript": [
    {
      name: "Basic Types",
      items: [
        {
          title: "Basic Types",
          code: "let isDone: boolean = false;\nlet decimal: number = 6;\nlet color: string = \"blue\";",
          description: "Basic TypeScript type annotations."
        },
        {
          title: "Arrays",
          code: "let list: number[] = [1, 2, 3];\nlet list2: Array<number> = [1, 2, 3];",
          description: "Array type annotations in TypeScript."
        },
        {
          title: "Tuple",
          code: "let x: [string, number] = [\"hello\", 10];",
          description: "Express an array with a fixed number of elements."
        }
      ]
    },
    {
      name: "Interfaces",
      items: [
        {
          title: "Interface Declaration",
          code: "interface User {\n  name: string;\n  id: number;\n}",
          description: "Describes the shape of an object."
        },
        {
          title: "Optional Properties",
          code: "interface User {\n  name: string;\n  age?: number;\n}",
          description: "Interface with optional properties."
        }
      ]
    }
  ],
  "git": [
    {
      name: "Basic Commands",
      items: [
        {
          title: "Git Init",
          code: "git init",
          description: "Initialize a new Git repository."
        },
        {
          title: "Git Clone",
          code: "git clone https://github.com/user/repo.git",
          description: "Clone a repository into a new directory."
        },
        {
          title: "Git Add",
          code: "git add .",
          description: "Add all changes to staging area."
        },
        {
          title: "Git Commit",
          code: "git commit -m \"Commit message\"",
          description: "Commit staged changes."
        }
      ]
    },
    {
      name: "Branching",
      items: [
        {
          title: "Create Branch",
          code: "git branch branch-name",
          description: "Create a new branch."
        },
        {
          title: "Switch Branch",
          code: "git checkout branch-name",
          description: "Switch to a different branch."
        },
        {
          title: "Create & Switch",
          code: "git checkout -b branch-name",
          description: "Create and switch to a new branch."
        }
      ]
    }
  ]
};

export default function CheatSheet() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("react");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const filteredCheatSheet = searchQuery
    ? Object.entries(cheatSheetData).flatMap(([language, categories]) => 
        categories.flatMap(category => 
          category.items
            .filter(item => 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(item => ({
              language,
              category: category.name,
              ...item
            }))
        )
      )
    : null;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Developer Cheat Sheets</h1>

      <div className="mb-6">
        <Input
          placeholder="Search across all cheat sheets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xl"
        />
      </div>

      {filteredCheatSheet ? (
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Search Results</h2>
          {filteredCheatSheet.length > 0 ? (
            <div className="space-y-4">
              {filteredCheatSheet.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      {item.language.toUpperCase()} / {item.category}
                    </div>
                    <h3 className="text-base font-medium mb-2">{item.title}</h3>
                    <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm mb-2 font-mono">
                      {item.code}
                    </pre>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          )}
        </div>
      ) : (
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <TabsList className="mb-6">
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
            <TabsTrigger value="git">Git</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedLanguage}>
            <div className="space-y-8">
              {cheatSheetData[selectedLanguage].map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-lg font-medium mb-4">{category.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex}>
                        <CardContent className="p-4">
                          <h3 className="text-base font-medium mb-2">{item.title}</h3>
                          <ScrollArea className="h-[100px] mb-2">
                            <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm font-mono">
                              {item.code}
                            </pre>
                          </ScrollArea>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
