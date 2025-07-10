import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "..", "proto", "calculator.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).calculator;

const calculator = {
	Add: (c, cb) => {
		const reply = { result: c.request.a + c.request.b };
		cb(null, reply);
	},
	Subtract: (c, cb) => {
		const reply = { result: c.request.a - c.request.b };
		cb(null, reply);
	},
	Multiply: (c, cb) => {
		const reply = { result: c.request.a * c.request.b };
		cb(null, reply);
	},
	Divide: (c, cb) => {
		const { a, b } = c.request;
		if (b === 0) {
			return cb({
				code: grpc.status.INVALID_ARGUMENT,
				message: "Division by zero is not allowed.",
			});
		}
		const reply = { result: a / b };
		cb(null, reply);
	},
	Sum: (c, cb) => {
		const numbers = c.request.numbers;
		const sum = numbers.reduce((acc, cur) => acc + cur, 0);
		const reply = { result: sum };
		cb(null, reply);
	},
};

const server = new grpc.Server();
server.addService(proto.Calculator.service, calculator);
server.bindAsync(
	"0.0.0.0:50051",
	grpc.ServerCredentials.createInsecure(),
	() => {
		console.log("gRPC server running at http://localhost:50051");
	},
);
