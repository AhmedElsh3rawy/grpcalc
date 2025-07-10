import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "..", "proto", "calculator.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).calculator;

const client = new proto.Calculator(
	"localhost:50051",
	grpc.credentials.createInsecure(),
);

let a = 10,
	b = 2;

client.Add({ a, b }, (err, res) => {
	if (err) return console.error(err);
	console.log("Addition result:", res.result);
});

client.Subtract({ a, b }, (err, res) => {
	if (err) return console.error(err);
	console.log("Subtraction result:", res.result);
});

client.Multiply({ a, b }, (err, res) => {
	if (err) return console.error(err);
	console.log("Multiplication result:", res.result);
});

client.Divide({ a, b }, (err, res) => {
	if (err) return console.error(err);
	console.log("Division result:", res.result);
});

client.Sum({ numbers: [1, 2, 3] }, (err, res) => {
	if (err) return console.log(err);
	console.log("Summtion result:", res.result);
});
