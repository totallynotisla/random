function bin2gray(bits) {
    let len = bits.length;
    let num = parseInt(bits.join(""), 2);

    if (num == 0) return [0];
    if (num == 1) return [1];

    let adapter =
        (parseInt(`${Array(len).fill(1).join("")}`, 2) -
            parseInt(
                `${Array(len - 1)
                    .fill(1)
                    .join("")}`,
                2
            )) /
        2;

    if ((num + 1).toString(2).length > len) {
        return [1, ...Array(len - 1).fill(0)];
    }

    if ((num + 2).toString(2).length > len) {
        return [1, ...Array(len - 2).fill(0), 1];
    }
    // if ((num + adapter).toString(2).length > len) {
    //     return [1, ...Array(len - adapter).fill(0), 1];
    // }

    return (num + adapter).toString(2).split("").map(Number);
}

function gray2bin(bits) {
    let len = bits.length;
    let num = parseInt(bits.join(""), 2);

    if (num == 0) return [0];
    if (num == 1) return [1];

    let adapter =
        (parseInt(`${Array(len).fill(1).join("")}`, 2) -
            parseInt(
                `${Array(len - 1)
                    .fill(1)
                    .join("")}`,
                2
            )) /
        2;

    if ((num - 1).toString(2).length > len) {
        return [1, ...Array(len - 1).fill(0)];
    }

    if ((num + 2).toString(2).length > len) {
        return [1, ...Array(len - 2).fill(0), 1];
    }

    return (num + adapter).toString(2).split("").map(Number);
}

console.log(bin2gray([1, 1]));
console.log(bin2gray([1, 1, 1, 1]));
console.log(bin2gray([1, 1, 0, 1]));
console.log(bin2gray(bin2gray([1, 0, 0, 0])));

console.log(bin2gray([1, 1]), [1, 0], "bin2gray([1, 1])");
console.log(bin2gray([1, 0, 1]), [1, 1, 1], "bin2gray([1, 0, 1])");

console.log(gray2bin([1, 0]), [1, 1], "gray2bin([1, 0])");
console.log(gray2bin([1, 1, 1]), [1, 0, 1], "gray2bin([1, 1, 1])");

//   it("gray2bin", function() {
//     assert.deepEqual(gray2bin([1, 0]), [1, 1], 'gray2bin([1, 0])');
//     assert.deepEqual(gray2bin([1, 1, 1]), [1, 0, 1], 'gray2bin([1, 1, 1])');
//   });
