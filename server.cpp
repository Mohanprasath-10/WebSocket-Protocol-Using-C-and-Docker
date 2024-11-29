#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <nlohmann/json.hpp>
#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/thread.hpp>
#include <boost/algorithm/string.hpp>

using json = nlohmann::json;
using tcp = boost::asio::ip::tcp;
namespace websocket = boost::beast::websocket;

class WebSocketServer {
public:
    WebSocketServer(boost::asio::io_context& ioc, tcp::endpoint endpoint)
        : m_acceptor(ioc, endpoint) {
        do_accept();
    }

private:
    tcp::acceptor m_acceptor;
    std::vector<std::shared_ptr<websocket::stream<tcp::socket>>> m_connections;

    void do_accept() {
        m_acceptor.async_accept([this](boost::system::error_code ec, tcp::socket socket) {
            if (!ec) {
                auto ws = std::make_shared<websocket::stream<tcp::socket>>(std::move(socket));
                m_connections.push_back(ws);
                ws->async_accept([this, ws](boost::system::error_code ec) {
                    if (!ec) {
                        do_read(ws);
                        std::cout << "Client connected" << std::endl;
                    }
                });
            }
            do_accept();
        });
    }

    void do_read(std::shared_ptr<websocket::stream<tcp::socket>> ws) {
        auto buffer = std::make_shared<boost::beast::flat_buffer>();
        ws->async_read(*buffer, [this, ws, buffer](boost::system::error_code ec, std::size_t) {
            if (!ec) {
                try {
                    auto message = boost::beast::buffers_to_string(buffer->data());
                    auto parsed_message = json::parse(message);
                    handle_client_message(ws, parsed_message);
                } catch (const std::exception& e) {
                    std::cerr << "Error parsing message: " << e.what() << std::endl;
                }
                do_read(ws);
            } else {
                std::cerr << "Client disconnected" << std::endl;
                m_connections.erase(std::remove(m_connections.begin(), m_connections.end(), ws), m_connections.end());
            }
        });
    }

    void handle_client_message(std::shared_ptr<websocket::stream<tcp::socket>> ws, const json& message) {
        if (message["action"] == "login") {
            handle_login(ws, message["payload"]);
        } else if (message["action"] == "getStudents") {
            handle_get_data(ws, "data/students.json", "studentsData");
        } else if (message["action"] == "addStudent") {
            handle_add(ws, "data/students.json", message["payload"], "updateSuccess");
        } else if (message["action"] == "deleteStudent") {
            handle_delete(ws, "data/students.json", message["payload"]["id"], "updateSuccess");
        } else if (message["action"] == "updateStudent") {
            handle_update(ws, "data/students.json", message["payload"], "updateSuccess");
        } else if (message["action"] == "getTeachers") {
            handle_get_data(ws, "data/teachers.json", "teachersData");
        } else if (message["action"] == "addTeacher") {
            handle_add(ws, "data/teachers.json", message["payload"], "updateSuccess");
        } else if (message["action"] == "deleteTeacher") {
            handle_delete(ws, "data/teachers.json", message["payload"]["id"], "updateSuccess");
        } else if (message["action"] == "updateTeacher") {
            handle_update(ws, "data/teachers.json", message["payload"], "updateSuccess");
        } else if (message["action"] == "getAdmins") {
            handle_get_data(ws, "data/admins.json", "adminsData");
        } else if (message["action"] == "addAdmin") {
            handle_add(ws, "data/admins.json", message["payload"], "updateSuccess");
        } else if (message["action"] == "deleteAdmin") {
            handle_delete(ws, "data/admins.json", message["payload"]["id"], "updateSuccess");
        } else if (message["action"] == "updateAdmin") {
            handle_update(ws, "data/admins.json", message["payload"], "updateSuccess");
        } else {
            std::cerr << "Unknown action: " << message["action"] << std::endl;
        }
    }

    void handle_login(std::shared_ptr<websocket::stream<tcp::socket>> ws, const json& payload) {
        if (payload["username"] == "admin" && payload["password"] == "password") {
            send_message(ws, json{{"action", "loginSuccess"}});
        } else {
            send_message(ws, json{{"action", "loginFailed"}});
        }
    }

    void handle_get_data(std::shared_ptr<websocket::stream<tcp::socket>> ws, const std::string& file_name, const std::string& action) {
        std::ifstream file(file_name);
        if (!file.is_open()) {
            std::cerr << "Error reading " << file_name << std::endl;
            send_message(ws, json{{"action", action}, {"data", json::array()}});
            return;
        }
        try {
            json parsed_data;
            file >> parsed_data;
            send_message(ws, json{{"action", action}, {"data", parsed_data}});
        } catch (const std::exception& e) {
            std::cerr << "Error parsing JSON from " << file_name << ": " << e.what() << std::endl;
            send_message(ws, json{{"action", action}, {"data", json::array()}});
        }
    }

    void handle_add(std::shared_ptr<websocket::stream<tcp::socket>> ws, const std::string& file_name, const json& item, const std::string& success_action) {
        json items = read_json(file_name);
        items.push_back(item);
        write_json(file_name, items);
        send_message(ws, json{{"action", success_action}});
    }

    void handle_delete(std::shared_ptr<websocket::stream<tcp::socket>> ws, const std::string& file_name, const std::string& id, const std::string& success_action) {
        json items = read_json(file_name);
        items.erase(std::remove_if(items.begin(), items.end(), [&](const json& item) { return item["id"] == id; }), items.end());
        write_json(file_name, items);
        send_message(ws, json{{"action", success_action}});
    }

    void handle_update(std::shared_ptr<websocket::stream<tcp::socket>> ws, const std::string& file_name, const json& updated_item, const std::string& success_action) {
        json items = read_json(file_name);
        for (auto& item : items) {
            if (item["id"] == updated_item["id"]) {
                item = updated_item;
                break;
            }
        }
        write_json(file_name, items);
        send_message(ws, json{{"action", success_action}});
    }

    json read_json(const std::string& file_name) {
        std::ifstream file(file_name);
        json data;
        if (file.is_open()) {
            file >> data;
        }
        return data;
    }

    void write_json(const std::string& file_name, const json& data) {
        std::ofstream out_file(file_name);
        out_file << data.dump(2);
    }

    void send_message(std::shared_ptr<websocket::stream<tcp::socket>> ws, const json& message) {
        ws->async_write(boost::asio::buffer(message.dump()), [ws](boost::system::error_code ec, std::size_t) {
            if (ec) {
                std::cerr << "Error sending message: " << ec.message() << std::endl;
            }
        });
    }
};

int main() {
    try {
        boost::asio::io_context ioc;
        WebSocketServer server(ioc, tcp::endpoint(tcp::v4(), 8080));
        std::cout << "WebSocket server running on ws://localhost:8080" << std::endl;
        ioc.run();
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}
