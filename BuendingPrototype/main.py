with open('foods.txt') as f:
    lines = f.readlines()
    for line in lines:
        line = line.split(',')

        print("<tr>")
        print("<td>" + line[0] + "</td>")
        print("<td>" + line[1] + "</td>")
        print("<td>" + line[2] + "</td>") #.replace("g","")
        print("<td>" + line[3] + "</td>")
        print("<td>" + line[4] + "</td>")
        print("</tr>")
